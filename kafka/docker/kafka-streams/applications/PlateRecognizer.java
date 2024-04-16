package applications;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Produced;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;
import java.io.ByteArrayInputStream;

import applications.token;

public class PlateRecognizer {

    private static final String IMAGE_CAPTURED_TOPIC = "imageCaptured";
    private static final String PLATE_RECOGNIZED_TOPIC = "plateRecognized";
    private static String lastUrl = "";

    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "plate-recognizer");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        final StreamsBuilder builder = new StreamsBuilder();

        ObjectMapper mapper = new ObjectMapper();

        builder.<String, String>stream(IMAGE_CAPTURED_TOPIC)
                .mapValues(value -> {
                    try {
                        JsonNode jsonNode = mapper.readTree(value);
                        JsonNode imageCaptured = jsonNode.path("value").path(IMAGE_CAPTURED_TOPIC);
                        if (imageCaptured.isMissingNode()) {
                            // Ignore messages without 'imageCaptured' field
                            return null;
                        }
                        JsonNode properties = imageCaptured.path("properties");
                        if (properties.isMissingNode()) {
                            // Ignore messages without 'properties' field
                            return null;
                        }
                        JsonNode timestampNode = properties.path("timestamp").path("value");
                        JsonNode imageIdNode = properties.path("imageId").path("properties").path("value");
                        JsonNode urlNode = properties.path("url").path("properties").path("value");

                        String timestamp = timestampNode.isMissingNode() ? "" : timestampNode.asText();
                        String imageId = imageIdNode.isMissingNode() ? "" : imageIdNode.asText();
                        String url = urlNode.isMissingNode() ? "" : urlNode.asText();

                        // Stop from posting on the update when the URL is processed
                        if(url.equals(lastUrl)) {
                            return null;
                        }

                        lastUrl = url;

                        // Make HTTP request to fetch image
                        CloseableHttpClient httpClient = HttpClients.createDefault();
                        HttpGet httpGet = new HttpGet(url);

                        try {
                            HttpResponse response = httpClient.execute(httpGet);
                            HttpEntity entity = response.getEntity();

                            if (entity != null) {
                                try (InputStream inputStream = entity.getContent()) {
                                    // Read the image bytes into a byte array
                                    byte[] imageBytes = IOUtils.toByteArray(inputStream);

                                    // Calculate the size of the image in bytes
                                    int imageSize = imageBytes.length;
                                    System.out.println("Image fetched successfully. Size: " + imageSize + " bytes");

                                    JsonNode result = mapper.createObjectNode()
                                            .put("timestamp", timestamp)
                                            .put("imageId", imageId)
                                            .put("url", url);

                                    return result.toString();
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        } finally {
                            httpClient.close();
                        }

                        return null;
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                })
                .filter((key, value) -> value != null)
                .to(PLATE_RECOGNIZED_TOPIC, Produced.with(Serdes.String(), Serdes.String()));

        final Topology topology = builder.build();
        final KafkaStreams streams = new KafkaStreams(topology, props);
        final CountDownLatch latch = new CountDownLatch(1);

        // attach shutdown handler to catch control-c
        Runtime.getRuntime().addShutdownHook(new Thread("streams-shutdown-hook") {
            @Override
            public void run() {
                streams.close();
                latch.countDown();
            }
        });

        try {
            streams.start();
            latch.await();
        } catch (Throwable e) {
            System.exit(1);
        }
        System.exit(0);
    }
}