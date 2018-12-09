import * as tf from "@tensorflow/tfjs";
import { MnistData } from "./data";

class CNN {

  constructor() {
    this.model = tf.sequential();
    this.LEARNING_RATE = 0.15;
    this.optimizer = tf.train.sgd(this.LEARNING_RATE);
    this.BATCH_SIZE = 64;
    this.TRAIN_BATCHES = 100;
    this.TEST_BATCH_SIZE = 1000;
    this.TEST_ITERATION_FREQUENCY = 5;
    this.data = new MnistData();
  }

  initializeLayers() {
    this.model.add(tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling'
    }));

    this.model.add(tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));

    this.model.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling'
    }));
    
    this.model.add(tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));

    this.model.add(tf.layers.flatten());
    this.model.add(tf.layers.dense({
      units: 10,
      kernelInitializer: 'VarianceScaling',
      activation: 'softmax'
    }));

    this.model.compile({
      optimizer: this.optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  }

  async trainingNetwork() {
    await this.data.load();
    this.initializeLayers();
    const { BATCH_SIZE, TRAIN_BATCHES, TEST_ITERATION_FREQUENCY, TEST_BATCH_SIZE, data, model  } = this;

    for (let i = 0; i < TRAIN_BATCHES; i++) {
      const batch = data.nextTrainBatch(BATCH_SIZE);
     
      let testBatch;
      let validationData;

      if (i % TEST_ITERATION_FREQUENCY === 0) {
        testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
        validationData = [
          testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), 
          testBatch.labels
        ];
      }
     
      const history = await model.fit(
          batch.xs.reshape([BATCH_SIZE, 28, 28, 1]),
          batch.labels,
          {
            batchSize: BATCH_SIZE,
            validationData,
            epochs: 1
          });
    
      const loss = history.history.loss[0];
      const accuracy = history.history.acc[0];
      console.log(history.validationData)
      console.log(loss)
      console.log(accuracy)
    }
  }
}

export default CNN;