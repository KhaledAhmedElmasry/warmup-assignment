const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
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


    if(startIsPmOrAm[1] == "pm" && start[0] != 12){
        startHours = startHours + 12;
    }
     if(endIsPmOrAm[1] == "pm" && end[0] != 12){
        endHours = endHours + 12;
    }
    if(startIsPmOrAm[1] == "am" && start[0] == 12){
        startHours = 0
    }
     if(endIsPmOrAm[1] == "am" && end[0] == 12){
        endHours = 0
    }

    let starthoursToSeconds = startHours * 3600;
    let startMinutesToSeconds = startMinutes * 60;

    let endhoursToSeconds = endHours * 3600;
    let  endMinutesToSeconds = endMinutes * 60;

    let startTotalTimeInSeconds = starthoursToSeconds + startMinutesToSeconds + startSeconds;
    let endTotalTimeInSeconds = endhoursToSeconds + endMinutesToSeconds + endSeconds;

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

    
    if(startIsPmOrAm[1] == "pm" && start[0] != 12){
        startHours = startHours + 12;
    }
     if(endIsPmOrAm[1] == "pm" && end[0] != 12){
        endHours = endHours + 12;
    }
    if(startIsPmOrAm[1] == "am" && start[0] == 12){
        startHours = 0
    }
     if(endIsPmOrAm[1] == "am" && end[0] == 12){
        endHours = 0
    }

    let startTotalInSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
    let endTotalInSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;

    let deliveryStart = 8 * 3600;
    let deliveryEnd = 22 * 3600;
    
    let idleSeconds = 0 ;

    if(startTotalInSeconds < deliveryStart){
        idleSeconds += deliveryStart - startTotalInSeconds;
    }
    if(endTotalInSeconds > deliveryEnd){
        idleSeconds += endTotalInSeconds - deliveryEnd;
    }

    let finalIdleHours = Math.floor(idleSeconds/3600).toString()
    let finalIdleMinutes = Math.floor((idleSeconds % 3600) / 60).toString().padStart(2,"0")
    let finalIdleSeconds = Math.floor(idleSeconds % 60).toString().padStart(2,"0")

    let finalIdleTotal = `${finalIdleHours}:${finalIdleMinutes}:${finalIdleSeconds}`

    return finalIdleTotal
    
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
    let idletMinutes = parseInt(idle[1])
    let idleSeconds = parseInt(idle[2])


    let shiftTotalTime = shiftHours * 3600 + shiftMinutes * 60 + shiftSeconds
    let idleTotalTime = idleHours * 3600 + idletMinutes * 60 + idleSeconds

    let activeTimeInSeconds = shiftTotalTime - idleTotalTime

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
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
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
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
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
    // TODO: Implement this function
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
    // TODO: Implement this function
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
