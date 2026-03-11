const fs = require("fs");


// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    startTime = startTime.trim();
    endTime = endTime.trim();

    let start = startTime.split(':');
    let startIsPmOrAm = start[2].split(" ")

    let end = endTime.split(":")
    let endIsPmOrAm = end[2].split(" ")

    let startHours = parseInt(start[0])
    let startMinutes = parseInt(start[1])
    let startSeconds = parseInt(startIsPmOrAm[0])

    let endHours = parseInt(end[0])
    let endMinutes = parseInt(end[1])
    let endSeconds = parseInt(endIsPmOrAm[0])


    if(startIsPmOrAm[1] == "pm" && startHours != 12){
        startHours = startHours + 12;
    }
     if(endIsPmOrAm[1] == "pm" && endHours != 12){
        endHours = endHours + 12;
    }
    if(startIsPmOrAm[1] == "am" && startHours == 12){
        startHours = 0
    }
     if(endIsPmOrAm[1] == "am" && endHours == 12){
        endHours = 0
    }

    let starthoursToSeconds = startHours * 3600;
    let startMinutesToSeconds = startMinutes * 60;

    let endhoursToSeconds = endHours * 3600;
    let  endMinutesToSeconds = endMinutes * 60;

    let startTotalTimeInSeconds = starthoursToSeconds + startMinutesToSeconds + startSeconds;
    let endTotalTimeInSeconds = endhoursToSeconds + endMinutesToSeconds + endSeconds;

    if(endTotalTimeInSeconds < startTotalTimeInSeconds){
    endTotalTimeInSeconds += 24 * 3600
    }

    let TotalTimeInSeconds = endTotalTimeInSeconds - startTotalTimeInSeconds

    let FinalHours = Math.floor(TotalTimeInSeconds/3600).toString();
    let FinalMinutes = Math.floor((TotalTimeInSeconds % 3600) / 60).toString().padStart( 2,"0")
    let FinalSeconds = (TotalTimeInSeconds % 60).toString().padStart(2,"0")
    
    let FinalTime = `${FinalHours}:${FinalMinutes}:${FinalSeconds}`

    return FinalTime

}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    startTime = startTime.trim();
    endTime = endTime.trim();

    function toSeconds(timeStr) {
        let parts = timeStr.split(":");
        let hour = parseInt(parts[0]);
        let minute = parseInt(parts[1]);
        let secAndPeriod = parts[2].split(" ");
        let second = parseInt(secAndPeriod[0]);
        let period = secAndPeriod[1];
        if (period == "pm" && hour != 12) hour += 12;
        if (period == "am" && hour == 12) hour = 0;
        return hour * 3600 + minute * 60 + second;
    }

    function overlap(aStart, aEnd, bStart, bEnd) {
        return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
    }

    let start = toSeconds(startTime);
    let end = toSeconds(endTime);

    if (end < start) end += 24 * 3600;

    let shiftDuration = end - start;
    let validSeconds = overlap(start, end, 8 * 3600, 22 * 3600);

    if (end > 24 * 3600) {
        validSeconds += overlap(start, end, 24 * 3600 + 8 * 3600, 24 * 3600 + 22 * 3600);
    }

    let idleSeconds = shiftDuration - validSeconds;

    let hours = Math.floor(idleSeconds / 3600).toString();
    let minutes = Math.floor((idleSeconds % 3600) / 60).toString().padStart(2, "0");
    let seconds = (idleSeconds % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}
// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    let shift = shiftDuration.split(":")
    let idle = idleTime.split(":")

    let shiftHours = parseInt(shift[0])
    let shiftMinutes = parseInt(shift[1])
    let shiftSeconds = parseInt(shift[2])

    let idleHours = parseInt(idle[0])
    let idleMinutes = parseInt(idle[1])
    let idleSeconds = parseInt(idle[2])


    let shiftTotalTime = shiftHours * 3600 + shiftMinutes * 60 + shiftSeconds
    let idleTotalTime = idleHours * 3600 + idleMinutes * 60 + idleSeconds

    let activeTimeInSeconds = Math.max(0, shiftTotalTime - idleTotalTime)
    
    let activeHours = Math.floor(activeTimeInSeconds / 3600).toString()
    let activeMinutes = Math.floor((activeTimeInSeconds % 3600) / 60).toString().padStart(2,"0")
    let activeSeconds = Math.floor(activeTimeInSeconds % 60).toString().padStart(2,"0")

    let totalActive = `${activeHours}:${activeMinutes}:${activeSeconds}`

    return totalActive

}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    let theDate = date.split("-")
    
    let year = parseInt(theDate[0])
    let month = parseInt(theDate[1])
    let day = parseInt(theDate[2])
    
    let quota;
    if(year === 2025 && month === 4 && day >= 10 && day <= 30){
        quota = 6 *3600
    }else{
        quota = 8 * 3600 + 24 * 60
    }

    let theActiveTime = activeTime.split(":")

    let activeHours = parseInt(theActiveTime[0])
    let activeMinutes = parseInt(theActiveTime[1])
    let activeSeconds = parseInt(theActiveTime[2])

    let activeHoursInSeconds = activeHours * 3600
    let activeMinutesInSeconds = activeMinutes * 60

    let totalActiveTimeInSeconds = activeHoursInSeconds + activeMinutesInSeconds + activeSeconds

    if(totalActiveTimeInSeconds < quota){
        return false
    }else{
        return true
    }
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
   
 const rows =  fs.readFileSync(textFile,'utf8').split("\n").filter(rows => rows.trim() != "").map(rows => rows.split(",")).map(row =>({
    driverID: row[0],
    driverName: row[1],
    date: row[2],
    startTime:row[3],
    endTime: row[4],
    shiftDuration: row[5],
    idleTime: row[6],
    activeTime: row[7],
    metQuota: row[8],
    hasBonus: row[9]

 }))

 if(rows.some(row => row.driverID == shiftObj.driverID && row.date == shiftObj.date)){
         return {}
 }else{
   const shiftDuration = getShiftDuration(shiftObj.startTime,shiftObj.endTime)
   const idleTime = getIdleTime(shiftObj.startTime,shiftObj.endTime)
   const activeTime = getActiveTime(shiftDuration,idleTime)
   const quotaMet = metQuota(shiftObj.date,activeTime)

    const newRecord = {
        
        driverID: shiftObj.driverID,
        driverName: shiftObj.driverName,
        date: shiftObj.date,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        shiftDuration: shiftDuration,
        idleTime:idleTime,
        activeTime: activeTime,
        metQuota: quotaMet,
        hasBonus: false
  }
  let lastIndex = -1;
  for(let i = 0; i < rows.length ; i++){
    if(rows[i].driverID == shiftObj.driverID){
        lastIndex = i;
    }
  }
 if(lastIndex == -1){
    rows.push(newRecord)
 }else{
    rows.splice(lastIndex + 1,0,newRecord)
  }
  const result =  rows.map(row => `${row.driverID},${row.driverName},${row.date},${row.startTime},${row.endTime},${row.shiftDuration},${row.idleTime},${row.activeTime},${row.metQuota},${row.hasBonus}`).join("\n")
 fs.writeFileSync(textFile,result + "\n")
 return newRecord
 }

}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    const rows = fs.readFileSync(textFile,'utf8').split("\n").filter(rows => rows.trim() != "").map(rows => rows.split(",")).map(row =>({
    driverID: row[0],
    driverName: row[1],
    date: row[2],
    startTime:row[3],
    endTime: row[4],
    shiftDuration: row[5],
    idleTime: row[6],
    activeTime: row[7],
    metQuota: row[8],
    hasBonus: row[9]
    }))

    for(let i = 0; i< rows.length ; i++){
        if(rows[i].driverID == driverID && rows[i].date == date){
            rows[i].hasBonus = newValue
        }
    }

    const result = rows.map(row => `${row.driverID},${row.driverName},${row.date},${row.startTime},${row.endTime},${row.shiftDuration},${row.idleTime},${row.activeTime},${row.metQuota},${row.hasBonus}`).join("\n") 
    fs.writeFileSync(textFile,result +"\n")
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    const rows = fs.readFileSync(textFile,'utf8').split("\n").filter(rows => rows.trim() != "").map(rows => rows.split(",")).map(row =>({
    driverID: row[0],
    driverName: row[1],
    date: row[2],
    startTime:row[3],
    endTime: row[4],
    shiftDuration: row[5],
    idleTime: row[6],
    activeTime: row[7],
    metQuota: row[8],
    hasBonus: row[9]
    }))
  
    if(!rows.some(row => row.driverID == driverID)){
      return -1;
    }
    
    const filteredDate = rows.filter(row =>{
        const rowMonth = parseInt(row.date.split("-")[1])
        const inputMonth = parseInt(month)
        return row.driverID == driverID && rowMonth == inputMonth && String(row.hasBonus).trim() === "true"
    })

   let length = filteredDate.length

   return length;

}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    const rows = fs.readFileSync(textFile,'utf8').split("\n").filter(rows => rows.trim() != "").map(rows => rows.split(",")).map(row =>({
    driverID: row[0],
    driverName: row[1],
    date: row[2],
    startTime:row[3],
    endTime: row[4],
    shiftDuration: row[5],
    idleTime: row[6],
    activeTime: row[7],
    metQuota: row[8],
    hasBonus: row[9]
    }))
    const filteredRows = rows.filter(row =>{
        const rowMonth = parseInt(row.date.split("-")[1])
        const inputMonth = parseInt(month)
        return row.driverID == driverID && rowMonth == inputMonth
    })

    if(filteredRows.length > 0){
        const TotalSeconds = filteredRows.reduce((total,row)=>{
            let parts = row.activeTime.trim().split(":")
            let totalSecondsActual = parseInt(parts[0]) *3600 +
                                     parseInt(parts[1]) * 60 +
                                     parseInt(parts[2])
            return total + totalSecondsActual
        },0)

        let FinalHours = Math.floor(TotalSeconds/3600).toString();
        let FinalMinutes = Math.floor((TotalSeconds % 3600) / 60).toString().padStart( 2,"0")
        let FinalSeconds = (TotalSeconds % 60).toString().padStart(2,"0")

        return `${FinalHours}:${FinalMinutes}:${FinalSeconds}`
    }

    return "0:00:00"
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    const rows = fs.readFileSync(textFile, 'utf8').split("\n").filter(row => row != "").map(row => row.split(",")).map(row => ({
        driverID: row[0].trim(),
        driverName: row[1].trim(),
        date: row[2],
        startTime: row[3],
        endTime: row[4],
        shiftDuration: row[5],
        idleTime: row[6],
        activeTime: row[7],
        metQuota: row[8],
        hasBonus: row[9]
    }));

    const rateRows = fs.readFileSync(rateFile, 'utf8').split("\n").filter(row => row != "").map(row => row.split(",")).map(row => ({
        driverID: row[0].trim(),
        dayOff: row[1].trim(),
        basePay: row[2],
        tier: row[3]
    }));

    const driverRate = rateRows.find(row => row.driverID == driverID);
    if(!driverRate){
    return "0:00:00"
    }
    const dayOff = driverRate.dayOff.trim();

    const filteredRows = rows.filter(row => {
        const rowMonth = parseInt(row.date.split("-")[1]);
        const inputMonth = parseInt(month);

        const dayName = new Date(row.date.trim() + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

        return row.driverID == driverID && rowMonth == inputMonth && dayName != dayOff;
    });

    let totalSeconds = filteredRows.reduce((total, row) => {
        const dateParts = row.date.trim().split("-");
        const year = parseInt(dateParts[0]);
        const mon = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);

        const isEid = year === 2025 && mon === 4 && day >= 10 && day <= 30;
        const dailyQuotaSeconds = isEid ? 6 * 3600 : 8 * 3600 + 24 * 60;

        return total + dailyQuotaSeconds;
    }, 0);

    totalSeconds -= bonusCount * 2 * 3600;
    if (totalSeconds < 0) totalSeconds = 0;
    const FinalHours = Math.floor(totalSeconds / 3600).toString();
    const FinalMinutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const FinalSeconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${FinalHours}:${FinalMinutes}:${FinalSeconds}`;
}
// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    const rateRows = fs.readFileSync(rateFile, 'utf8')
        .split("\n")
        .filter(row => row.trim() != "")
        .map(row => row.trim().split(","))
        .map(row => ({
            driverID: row[0].trim(),
            dayOff: row[1].trim(),
            basePay: parseInt(row[2].trim()),
            tier: parseInt(row[3].trim())
        }));

    const driverRate = rateRows.find(row => row.driverID == driverID.trim());
    if(!driverRate){
    return 0
    }
    const basePay = driverRate.basePay;
    const tier = driverRate.tier;

    const toSeconds = (timeStr) => {
        const parts = timeStr.trim().split(":");
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }

    const actualSeconds = toSeconds(actualHours);
    const requiredSeconds = toSeconds(requiredHours);

    if (actualSeconds >= requiredSeconds) {
        return basePay;
    }

    const allowedMissingHours = { 1: 50, 2: 20, 3: 10, 4: 3 };
    const allowedSeconds = (allowedMissingHours[tier] || 0) * 3600;

    const missingSeconds = requiredSeconds - actualSeconds;
    const billableMissingSeconds = missingSeconds - allowedSeconds;

    if (billableMissingSeconds <= 0) {
        return basePay;
    }

    const billableFullHours = Math.floor(billableMissingSeconds / 3600);
    const deductionRatePerHour = Math.floor(basePay / 185);
    const salaryDeduction = billableFullHours * deductionRatePerHour;

    return basePay - salaryDeduction;
}
module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
