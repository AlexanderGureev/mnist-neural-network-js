import React, { Component } from "react";
import mnist from "mnist";
import CoreNet from "./coreNet";

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
  componentDidMount() {
    const neuralNetwork = this.initializeNeuralNetwork();
    const { training, test } = this.getDataset(100, 10);

    // neuralNetwork.trainNetwork(training, 2);
    // neuralNetwork.testingNetwork(test);

    neuralNetwork.testGpu();
  }

  render() {
    return (
      <div>Neural Network</div>
    );
  }
}

export default NeuralNetwork;
