const line_labels = 120;


function line_chart(networth, dates) {   
   const ctx = document.getElementById('myChart')
    const myChart = new Chart(ctx, {
        
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Net Worth $',
                data: networth,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            }]
        },
        options: {
            
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Net Worth ($)'
                    },
                    beginAtZero: true,
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, ticks) {
                            return '$' + value;
                        }
                    },

                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }


            },

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function donut_chart(total_investable, total_crypto, total_cash, total_personal_assets) {

    const ctx_2 = document.getElementById('myChart_2')
    const myChart3 = new Chart(ctx_2, {
        
        type: 'pie',
        data: {
            labels: ['Investable Assets', 'Crypto', 'Cash', 'Personal Assets'],
            datasets: [{
                label: 'Net Worth $',
                data: [total_investable, total_crypto, total_cash, total_personal_assets],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],

                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 5,
                
            }]
        },
        options: {
            
            plugins: {
                legend: {
                    display: true
                },
            },
            "responsive": true,
            "maintainAspectRatio": false
        }
    });
}

function line_chart_investable(taxable, dates, tfsa, rrsp, other_investable) {   
    const ctx = document.getElementById('myChart_investable')
     const myChart2 = new Chart(ctx, {
         
         type: 'line',
         data: {
             labels: dates,
             datasets: [{
                 label: 'Taxable',
                 data: taxable,
                 pointBackgroundColor:'rgba(1, 1, 1, 1)',
                 borderWidth: 1,
                 borderColor: 'rgba(1, 1, 1, 1)'
             },

             {
                label: 'TFSA',
                data: tfsa,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'RRSP',
                data: rrsp,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'Other Investable',
                data: other_investable,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },]
         },
         options: {
             
             scales: {
                 y: {
                     title: {
                         display: true,
                         text: 'Dollars ($)'
                     },
                     beginAtZero: true,
                     ticks: {
                         // Include a dollar sign in the ticks
                         callback: function(value, index, ticks) {
                             return '$' + value;
                         }
                     },
 
                 },
                 x: {
                     title: {
                         display: true,
                         text: 'Date'
                     }
                 }
 
 
             },
 
             plugins: {
                 legend: {
                     display: false
                 }
             }
         }
     });
 }

function pie_chart_investable(taxable, tfsa, rrsp, other_investable) {

    const ctx_3 = document.getElementById('pie_investable')
    const myChart4 = new Chart(ctx_3, {
        
        type: 'pie',
        data: {
            labels: ['Taxable', 'TFSA', 'RRSP', 'Other Investable Assets'],
            datasets: [{
                label: 'Net Worth $',
                data: [taxable, tfsa, rrsp, other_investable],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],

                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 5,
                
            }]
        },
        options: {
            
            plugins: {
                legend: {
                    display: true
                },
            },
            "responsive": true,
            "maintainAspectRatio": false
        }
    });
}

