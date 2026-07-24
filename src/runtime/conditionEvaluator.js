export default class ConditionEvaluator {

    constructor(runtimeState) {

        this.runtimeState = runtimeState;

    }

    evaluate(condition) {

        const value = this.runtimeState.variables.get(condition.variable);

        switch (condition.operator) {

            case "==":
                return value == condition.value;

            case "!=":
                return value != condition.value;

            case ">":
                return value > condition.value;

            case "<":
                return value < condition.value;

            case ">=":
                return value >= condition.value;

            case "<=":
                return value <= condition.value;

            default:
                throw new Error(
                    `Unsupported operator: ${condition.operator}`
                );

        }

    }

}