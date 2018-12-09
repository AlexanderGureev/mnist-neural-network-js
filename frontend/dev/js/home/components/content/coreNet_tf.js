import * as tf from "@tensorflow/tfjs";

const initializeNeuralNetwork = () => {
  const model = tf.sequential();

  const config_hidden = {
    inputShape: [784],
    activation: "sigmoid",
    units: 100
  };
  const config_output = {
    units: 10,
    activation: "sigmoid"
  };

  const hidden = tf.layers.dense(config_hidden);
  const output = tf.layers.dense(config_output);

  model.add(hidden);
  model.add(output);

  const optimize = tf.train.sgd(0.1);

  const config = {
    optimizer: optimize,
    loss: "meanSquaredError"
  };

  model.compile(config);
  console.log("Model Successfully Compiled");

  return model;
};

const _train = async (model, inputs, outputs) => {
  const callbacks = { 
    onEpochEnd: async (epoch, log) => {
      console.log(`Epoch ${epoch}: loss = ${log.loss}`);
    }
  };

  const res = await model.fit(inputs, outputs, { epochs: 5, callbacks });
  return res;
};

const normilizeDataset = dataset => {
  const inputs = dataset.map(({ input }) => input);
  const outputs = dataset.map(({ output }) => output);

  return { inputs, outputs };
};

export const trainNetwork = async (trainingSet, model, trainingAmount) => {
  const { inputs, outputs } = normilizeDataset(trainingSet);

  const inputsTensor = tf.tensor(inputs, [trainingAmount, 784]);
  const outputsTensor = tf.tensor(outputs, [trainingAmount, 10]);

  const res = await _train(model, inputsTensor, outputsTensor);
  console.log(res.history);
  console.log('Training is Complete');
  console.log('Predictions :');
  return model;

};

export const testNetwork = (model, testSet, testingAmount) => {
  const { inputs, outputs } = normilizeDataset(testSet);

  const inputsTensor = tf.tensor(inputs, [testingAmount, 784]);
  const outputsTensor = tf.tensor(outputs, [testingAmount, 10]);

  outputsTensor.print();
  model.predict(inputsTensor).print();

}
export default initializeNeuralNetwork;
