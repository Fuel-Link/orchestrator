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

public class PlateRecognizer {

    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "plate-recognizer");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        final StreamsBuilder builder = new StreamsBuilder();

        ObjectMapper mapper = new ObjectMapper();

        builder.<String, String>stream("imageCaptured")
                .mapValues(value -> {
                    try {
                        JsonNode jsonNode = mapper.readTree(value);
                        JsonNode imageCaptured = jsonNode.path("value").path("imageCaptured");
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

                        JsonNode result = mapper.createObjectNode()
                                .put("timestamp", timestamp)
                                .put("imageId", imageId)
                                .put("url", url);

                        return result.toString();
                    } catch (IOException e) {
                        e.printStackTrace();
                        return null;
                    }
                })
                .filter((key, value) -> value != null)
                .to("plateRecognized", Produced.with(Serdes.String(), Serdes.String()));

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
