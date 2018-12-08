import random from "random";
import GPU from "gpu.js";
import {
  matrix,
  transpose,
  multiply,
  dotMultiply,
  map,
  subtract,
  add,
  flatten
} from "mathjs";

const createRandomNormalMatrix = (n, m, nodes) => {
  const rand = random.normal(0, Math.pow(nodes, -0.5));
  const _array = Array.from({ length: n }).map(e =>
    Array.from({ length: m }, x => rand())
  );
  return matrix(_array);
};

class CoreNet {
  constructor(inputNodes, hiddenNodes, outputNodes, lerningRate) {
    this.iNodes = inputNodes;
    this.hNodes = hiddenNodes;
    this.oNodes = outputNodes;
    this.lRate = lerningRate;

    this.wih = createRandomNormalMatrix(this.hNodes, this.iNodes, this.iNodes);
    this.who = createRandomNormalMatrix(this.oNodes, this.hNodes, this.hNodes);

    this.lRate = lerningRate;
    this.activationFn = x => 1 / (1 + Math.exp(-x));
    this.gpu = new GPU();
  }

  directDistCalc = inputs => {
    const { wih, who, activationFn } = this;

    const hiddenInputs = multiply(wih, inputs);
    const hiddenOutputs = map(hiddenInputs, activationFn);

    const finalInputs = multiply(who, hiddenOutputs);
    const finalOutputs = map(finalInputs, activationFn);

    return {
      hiddenInputs,
      hiddenOutputs,
      finalInputs,
      finalOutputs
    };
  };

  gpuMultiply = (a, b) => {
    const multiplyMatrix = this.gpu.createKernel(function(a, b) {
      var sum = 0;
      for (var i = 0; i < 2; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
      }
      return sum;
    }).setOutput([3, 3]);
  }
  testGpu = () => {
    const A = matrix([[3, 1], [1, 2]]);
    const B = matrix([[2, 2], [3, 1]]);

    const gpu = new GPU();

    const options = {
      constants: { size: A._size[1] },
      output: [A._size[0], B._size[1] ],
    };

    const multiplyMatrix = gpu.createKernel(function(a, b) {
      let sum = 0;
      for (let i = 0; i < this.constants.size; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
      }
      return sum;
    }, options);
    
    const res = multiplyMatrix(A._data, B._data)
    console.log(res)
  }
  normalizeDataset = dataset => {
    const _outputNormalize = output => output.map(item => (item === 1 ? 0.99 : 0.01));
      
    const normalizedDataset = dataset.reduce((acc, { input, output }) => {
      return [...acc, { input, output: _outputNormalize(output) }];
    }, []);

    return normalizedDataset;
  };

  testingNetwork = testSet => {
    const correctAnswer = 0.99;
    const normalizedDataset = this.normalizeDataset(testSet);
    
    const testValues = normalizedDataset.map(({ output }) => output.indexOf(correctAnswer));
    console.log(`Test input values: ${testValues}`);

    const resultsTesting = normalizedDataset.map(({ input }) => this.query(input));
    const flattedResultsTesting = resultsTesting.map(({ _data }) => flatten(_data));
    const outputValues = flattedResultsTesting.map(output => output.indexOf(Math.max(...output)));

    console.log(`Test output values: ${outputValues}`);

    const matches = testValues.reduce((acc, x, i) => {
      return x === outputValues[i] ? acc + 1 : acc;
    }, 0);

    const precision = matches / testValues.length;
    console.log(`Precision: ${precision * 100}%`);
  }

  query(inputList) {
    const inputs = transpose(matrix([inputList]));
    const { finalOutputs } = this.directDistCalc(inputs);
    return finalOutputs;
  }

  trainNetwork(trainingSet, epochs = 1) {
    const normalizedDataset = this.normalizeDataset(trainingSet);

    console.time("timer");
    for (let i = 0; i < epochs; i++) {
      console.log(`Epoch: ${i}`);
      normalizedDataset.forEach(({ input, output }, i) => {
        console.log(`Number of training sample: ${i}`);
        this._train(input, output)
      });
    }
    console.timeEnd("timer");
  }

  _train(inputList, targetList) {
    const { who, wih, lRate, directDistCalc } = this;

    const inputs = transpose(matrix([inputList]));
    const targets = transpose(matrix([targetList]));

    const { hiddenOutputs, finalOutputs } = directDistCalc(inputs);

    const outputErrors = matrix(subtract(targets, finalOutputs));
    const hiddenErrors = multiply(transpose(who), outputErrors);

    const deltaWeightWih = dotMultiply(
      lRate,
      multiply(
        dotMultiply(
          dotMultiply(hiddenErrors, hiddenOutputs),
          matrix(subtract(1, hiddenOutputs))
        ),
        transpose(inputs)
      )
    );

    const deltaWeightWho = dotMultiply(
      lRate,
      multiply(
        dotMultiply(
          dotMultiply(outputErrors, finalOutputs),
          matrix(subtract(1, finalOutputs))
        ),
        transpose(hiddenOutputs)
      )
    );

    this.who = add(who, deltaWeightWho);
    this.wih = add(wih, deltaWeightWih);
  }
}

export default CoreNet;
