

function statement(invoice, plays){

    function playFor(aPerformance){
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance){   // 값이 바뀌지 않는 변수는 매개변수로 전달
        let result = 0; // 변수를 초기화 하는 코드

        switch (playFor(aPerformance).type){
            case "tragedy": // 비극
                result = 40000;
                if(aPerformance.audience > 30){
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if(aPerformance.audience > 20){
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw  new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
        }
        return result; // 함수 안에서 값이 바뀌는 변수 반환
    }

    function volumeCreditsFor(aPerformance){
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function usd(aNumber){
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency : "USD",
                minimumFractionDigits : 2 }).format(aNumber/100);
    }

    function totalVolumeCredits(){
        let volumeCredits = 0;
        for(let perf of invoice.performances){
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }

    let totalAmount = 0;
    let result = `청구 내역 (고객명 : ${invoice.customer})\n`;
    for(let perf of invoice.performances){

        // 청구 내역을 출력한다.
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
        totalAmount += amountFor(perf);
    }

    result += `총액: ${usd(totalAmount)}\n`;
    result += `적립 포인트 : ${totalVolumeCredits()}점\n`;
    return result;
}

function readJSON(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}