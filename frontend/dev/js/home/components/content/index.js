import React, { Component, Fragment } from "react";
import mnist from "mnist";
import * as math from "mathjs";
import random from "random";
import CoreNet from "./coreNet";

class NeuralNetwork extends Component {

  constructor(props) {
    super(props);
    this.refCanvas = React.createRef();
    this.set = mnist.set(1000, 10);
    this.trainingSet = this.set.training;
    this.testSet = this.set.test;
  }

  initializeCanvas = () => {
    const ctx = this.refCanvas.current.getContext("2d");
    return ctx;
  }
  draw = digit => {
    const ctx = this.initializeCanvas();
    mnist.draw(digit, ctx);
  }
  normalizeDataset = dataset => {
    const targets = dataset.map(item => item === 1 ? 0.99 : 0.01);
    return targets;
  }
  getResultTests = neuralNet => {
    this.testSet.forEach(({ input, output }, i) => {
      const res = neuralNet.query(input);
      console.log(i)
      console.log(output)
      console.log(res)
    })
  }
  componentDidMount() {
    const inputNodes = 784;
    const hiddenNodes = 200;
    const outputNodes = 10;

    const learningRate = 0.1;
    const epochs = 3;

    const neuralNet = new CoreNet(inputNodes, hiddenNodes, outputNodes, learningRate);

    console.log("Обучение");
    console.time("timer")

    for (let i = 0; i < epochs; i++) {
      this.trainingSet.forEach(({ input, output }, i) => {
        console.log("1")
        const targets = this.normalizeDataset(output);
        neuralNet.train(input, targets);
      });
    }
    console.timeEnd("timer");

    console.log("Тестирование")
    this.getResultTests(neuralNet);
  }

  render() {
    return (
      <canvas ref={this.refCanvas} id="digit-canvas" width="150" height="150" />
    );
  }
}

export default NeuralNetwork;
