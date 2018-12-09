import React, { Component } from "react";
import mnist from "mnist";
import CoreNet from "./coreNet";
import initializeNeuralNetwork, {
  trainNetwork,
  testNetwork
} from "./coreNet_tf";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { message } from "antd";
import CNN from "./CNN_tf";

class NeuralNetwork extends Component {
  state = {
    target: [],
    data: []
  };

  initializeNeuralNetwork = (
    iNodes = 784,
    hNodes = 200,
    oNodes = 10,
    lRate = 0.1
  ) => new CoreNet(iNodes, hNodes, oNodes, lRate);

  getDataset = (trainingAmount = 100, testAmount = 10) =>
    mnist.set(trainingAmount, testAmount);
  setLoader = () => (this.loader = message.loading("Обучение сети...", 0));
  stopLoader = (cb = () => {}) => {
    if (this.loader) {
      this.loader();
      this.loader = null;
    }
    setTimeout(cb, 1000);
  };

  async componentDidMount() {
    //this.setLoader();
    //const neuralNetwork = this.initializeNeuralNetwork();
    const { training, test } = this.getDataset(10, 10);
    // neuralNetwork.trainNetwork(training, 2);
    // neuralNetwork.testingNetwork(test);

    //neuralNetwork.testGpu();

    const model = initializeNeuralNetwork();
    const trainedModel = await trainNetwork(model, training, training.length);
    const { target, predicts } = await testNetwork(
      trainedModel,
      test,
      test.length
    );

    const data = predicts.reduce((acc, item, i) => {
      const m = item.map((item, i) => ({ name: i, uv: item }));
      return [...acc, m];
    }, []);

    this.setState({ target, data });
    //this.stopLoader();
    // const cnn = new CNN();
    // cnn.trainingNetwork();
  }

  render() {
    return (
      <div>
        {this.state.data.map((mass, i) => (
          <div key={i}>
            <h3>Predict: {this.state.target[i]}</h3>
            <BarChart key={i} width={600} height={150} data={mass}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </div>
        ))}
      </div>
    );
  }
}

export default NeuralNetwork;
