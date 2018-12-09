import React, { Component } from "react";
import mnist from "mnist";
import CoreNet from "./coreNet";
import initializeNeuralNetwork, { trainNetwork, testNetwork } from "./coreNet_tf";
import CNN from "./CNN_tf";


class NeuralNetwork extends Component {

  initializeNeuralNetwork = (
    iNodes = 784,
    hNodes = 200,
    oNodes = 10,
    lRate = 0.1
  ) => new CoreNet(iNodes, hNodes, oNodes, lRate);

  getDataset = (trainingAmount = 100, testAmount = 10) => {
    return mnist.set(trainingAmount, testAmount);
  }
  async componentDidMount() {
    //const neuralNetwork = this.initializeNeuralNetwork();
    const { training, test } = this.getDataset(8000, 10);
    // neuralNetwork.trainNetwork(training, 2);
    // neuralNetwork.testingNetwork(test);

    //neuralNetwork.testGpu();

    // const model = initializeNeuralNetwork();
    // const trainedModel = await trainNetwork(training, model, 8000);

    // testNetwork(trainedModel, test, 10);

    const cnn = new CNN();
    cnn.trainingNetwork();
    
  }

  render() {
    return (
      <div>Neural Network</div>
    );
  }
}

export default NeuralNetwork;
