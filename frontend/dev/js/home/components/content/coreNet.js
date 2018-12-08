import random from "random";
import * as math from "mathjs";

const createRandomNormalMatrix = (n, m, nodes) => {
  const rand = random.normal(0, Math.pow(nodes, -0.5));
  const _array = Array.from({ length: n }).map(e =>
    Array.from({ length: m }, x => rand())
  );
  const matrix = math.matrix(_array);

  return matrix;
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
  }

  get _wih() {
    return this.wih._size;
  }

  query(inputList) {
    const inputs = math.transpose(math.matrix([inputList]));

    const hiddenInputs = math.multiply(this.wih, inputs);
    const hiddenOutputs = math.map(hiddenInputs, this.activationFn);

    const finalInputs = math.multiply(this.who, hiddenOutputs);
    const finalOutputs = math.map(finalInputs, this.activationFn);

    return finalOutputs;
  }

  train(inputList, targetList) {
    const inputs = math.transpose(math.matrix([inputList]));
    const targets = math.transpose(math.matrix([targetList]));

    const hiddenInputs = math.multiply(this.wih, inputs);
    const hiddenOutputs = math.map(hiddenInputs, this.activationFn);

    const finalInputs = math.multiply(this.who, hiddenOutputs);
    const finalOutputs = math.map(finalInputs, this.activationFn);

    const outputErrors = math.matrix(math.subtract(targets, finalOutputs));
    const hiddenErrors = math.multiply(math.transpose(this.who), outputErrors);

    const dMul = math.dotMultiply;
    const mul = math.multiply;

    const resMultiplyWih = mul(
      dMul(
        dMul(hiddenErrors, hiddenOutputs),
        math.matrix(math.subtract(1, hiddenOutputs))
      ),
      math.transpose(inputs)
    );
    const deltaWeightWih = dMul(this.lRate, resMultiplyWih);

    const resMultiplyWho = mul(
      dMul(
        dMul(outputErrors, finalOutputs),
        math.matrix(math.subtract(1, finalOutputs))
      ),
      math.transpose(hiddenOutputs)
    );
    const deltaWeightWho = dMul(this.lRate, resMultiplyWho);

    this.who = math.add(this.who, deltaWeightWho);
    this.wih = math.add(this.wih, deltaWeightWih);
  }
}

export default CoreNet;
