export class CSVHelper {
    
     static _exportToCSVFile(csvData, filename) {
        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename);
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }
  
    static convertToCSV(dataArray, fields, titles) {
        let array = typeof dataArray != 'object' ? JSON.parse(dataArray) : dataArray;
        let csvRows = '';
        for (let i = 0; i < array.length; i++) {
            let line = (i+1)+'';
            for (let index in fields) {
                let head = fields[index];
                line += ',' + array[i][head];
            }
            csvRows += line + '\r\n';
        }
        return csvRows;
    }
   }