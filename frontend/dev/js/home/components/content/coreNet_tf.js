import * as tf from "@tensorflow/tfjs";

const initializeNeuralNetwork = () => {
  const model = tf.sequential();

  const config_hidden = {
    inputShape: [784],
    activation: "sigmoid",
    units: 100,
    kernelInitializer: 'VarianceScaling',
  };
  const config_output = {
    units: 10,
    activation: "sigmoid",
    kernelInitializer: 'VarianceScaling',
  };

  const hidden = tf.layers.dense(config_hidden);
  const output = tf.layers.dense(config_output);

  model.add(hidden);
  model.add(output);

  const optimize = tf.train.sgd(0.1);

  const config = {
    optimizer: optimize,
    loss: "meanSquaredError",
    metrics: ['accuracy'],
  };

  model.compile(config);
  console.log("Model Successfully Compiled");

  return model;
};

const _train = async (model, inputs, outputs) => {
  const callbacks = { 
    onEpochEnd: async (epoch, log) => {
      console.log(`Epoch ${epoch}: loss = ${log.loss}, acc = ${log.acc}`);
    }
  };

  const res = await model.fit(inputs, outputs, { epochs: 20, callbacks });
  return res;
};

const normilizeDataset = dataset => {
  const inputs = dataset.map(({ input }) => input);
  const outputs = dataset.map(({ output }) => output);

  return { inputs, outputs };
};

export const trainNetwork = async (model, trainingSet, trainingAmount) => {
  const { inputs, outputs } = normilizeDataset(trainingSet);

  const inputsTensor = tf.tensor(inputs, [trainingAmount, 784]);
  const outputsTensor = tf.tensor(outputs, [trainingAmount, 10]);

  const res = await _train(model, inputsTensor, outputsTensor);
  console.log('Training is Complete');
  return model;
};

const formateResults = mass => {
  let tmp = [], res = [];
  mass.forEach((item, i) => {
    tmp.push(item);

    if(++i % 10 === 0) {
      res.push(tmp);
      tmp = [];
    }
  });
  return res;
};

export const testNetwork = async (model, testSet, testingAmount) => {
  const { inputs, outputs } = normilizeDataset(testSet);

  const inputsTensor = tf.tensor(inputs, [testingAmount, 784]);
  const outputsTensor = tf.tensor(outputs, [testingAmount, 10]);

  const x = await outputsTensor.data();
  const y = await model.predict(inputsTensor).data();

  const predicts = formateResults(y);
  const target = formateResults(x).map(mass => mass.indexOf(1));

  return { target, predicts };
}
export default initializeNeuralNetwork;
