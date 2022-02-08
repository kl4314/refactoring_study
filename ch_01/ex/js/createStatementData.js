
class PerformanceCalculator{
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {   // 값이 바뀌지 않는 변수는 매개변수로 전달
        let result = 0; // 변수를 초기화 하는 코드

        switch (this.play.type) {
            case "tragedy": // 비극
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw  new Error(`알 수 없는 장르 : ${this.play.type}`);
        }
        return result; // 함수 안에서 값이 바뀌는 변수 반환
    }

    get volumeCredits(){
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type)
            result += Math.floor(this.performance.audience / 5);
        return result;
    }


}

class TragedyCalculator extends PerformanceCalculator{
}
class ComedyCalculator extends PerformanceCalculator{
}

function createPerformanceCalculator(aPerformance, aPlay){
    switch (aPlay.type) {
        case 'tragedy' : return new TragedyCalculator(aPerformance, aPlay);
        case 'comedy' : return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`알 수 없는 장르: ${aPlay.type}`);
    }
    return new PerformanceCalculator(aPerformance, aPlay);
}
export default function createStatementData(invoice,plays) {

    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;


    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }


    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function amountFor(aPerformance){
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }
}