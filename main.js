'use strict'

agGrid.initialiseAgGridWithAngular1(angular);

var module = angular.module('quoteboardGrid', ['agGrid']);

module.controller('quoteboardGridCtrl', [ '$scope', '$interval', 'mainFactory', function($scope, $interval, mainFactory){
    $scope.symbolName = '';    
  
    $scope.gridOptions = mainFactory.getTable();

    $scope.addNewRow = function(){
        mainFactory.addRow($scope.symbolName);
    };    

}]);
module.service('mainFactory', [ '$interval', function($interval) {
    var minPrice = 100,
        maxPrice = 5000,
        rowData = [];   

    for (var i = 0; i < 4; i++) {
        addRow();
    }

    var columnDefs = [
        {headerName: 'Symbol', field: 'symbol'},
        {headerName: 'Last', field: 'last', cellRenderer:'agAnimateSlideCellRenderer'},
        {headerName: 'Change', field: 'change', cellRenderer: 'agAnimateShowChangeCellRenderer'},
        {headerName: 'High', field: 'high', cellRenderer: 'agAnimateShowChangeCellRenderer'},
        {headerName: 'Low', field: 'low', cellRenderer: 'agAnimateShowChangeCellRenderer'}
    ];

    var gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        rowHeight: 35,
        enableColResize: true,
        animateRows: true,
        defaultColDef: {
            valueFormatter: function (params) {
                if(typeof(params.value) === 'number'){
                    return formatNumber(params.value);
                }
            },
            cellClass: 'align-right'
        },
        onGridReady: function(params) {params.api.sizeColumnsToFit();}
    };

    function formatNumber(number) {
        return Math.floor(number).toString().replace(/(\d)(?=(\d{2})+(?!\d))/g, "$1,");
    }

    function generateDataForNewRow(symbolName){
        var newPrice = generateRandomNumber(minPrice, maxPrice);
        var row = {
            symbol: symbolName ? symbolName :  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
              last: newPrice < 1 ? 0 : newPrice, 
            change: newPrice, 
              high: newPrice, 
               low: newPrice
        };
        return row;
    }

    function changeData(row, index) {
        var price = generateRandomNumber(minPrice, maxPrice),
            rowNode = gridOptions.api.getDisplayedRowAtIndex(index);

        rowNode.setDataValue('low', (price < row.low ? price : row.low) );
        rowNode.setDataValue('high', price > row.high ? price : row.high);
        rowNode.setDataValue('change', (row.last - price).toFixed(2));
        rowNode.setDataValue('last', price < 1 ? 0 : price);
    }

    function generateRandomNumber(min, max){
        return +( Math.random()* ( max - min + 0.87)).toFixed(2);
    }    
    
    function addRow(symbolName){
        rowData.push(generateDataForNewRow(symbolName));
    }

    $interval(function() {
        var countUpdatesRow = Math.floor(Math.random() * rowData.length);
        changeData(rowData[countUpdatesRow], countUpdatesRow);
    }, 700);

    this.getTable = function () {
        return gridOptions;
    };

    this.addRow = function (symbol) {
        addRow(symbol);
    };
}]);