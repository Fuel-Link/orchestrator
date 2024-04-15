package applications;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.utils.Bytes;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.Produced;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.apache.kafka.streams.state.KeyValueStore;
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

        builder.<String, String>stream("imageCaptured")
                .process(() -> new JsonProcessor("plateRecognized"));

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

    static class JsonProcessor extends AbstractProcessor<String, String> {
        private final String outputTopic;
        private final ObjectMapper mapper;
        private ProcessorContext context;

        public JsonProcessor(String outputTopic) {
            this.outputTopic = outputTopic;
            this.mapper = new ObjectMapper();
        }

        @Override
        public void init(ProcessorContext context) {
            this.context = context;
        }

        @Override
        public void process(String key, String value) {
            try {
                JsonNode jsonNode = mapper.readTree(value);
                JsonNode imageCaptured = jsonNode.path("value").path("imageCaptured");
                String timestamp = imageCaptured.path("properties").path("timestamp").path("value").asText();
                String imageId = imageCaptured.path("properties").path("imageId").path("properties").path("value").asText();
                String url = imageCaptured.path("properties").path("url").path("properties").path("value").asText();

                JsonNode result = mapper.createObjectNode()
                        .put("timestamp", timestamp)
                        .put("imageId", imageId)
                        .put("url", url);

                context.forward(key, result.toString());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
