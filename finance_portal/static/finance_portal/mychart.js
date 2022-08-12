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

function line_chart_crypto(bitcoin, dates, ethereum, other_crypto) {   
    const ctx = document.getElementById('myChart_crypto')
     const myChart5 = new Chart(ctx, {
         
         type: 'line',
         data: {
             labels: dates,
             datasets: [{
                 label: 'Bitcoin',
                 data: bitcoin,
                 pointBackgroundColor:'rgba(1, 1, 1, 1)',
                 borderWidth: 1,
                 borderColor: 'rgba(1, 1, 1, 1)'
             },

             {
                label: 'Ethereum',
                data: ethereum,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'Other',
                data: other_crypto,
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

function pie_chart_crypto(bitcoin, ethereum, other_crypto) {

    const ctx_3 = document.getElementById('pie_crypto')
    const myChart6 = new Chart(ctx_3, {
        
        type: 'pie',
        data: {
            labels: ['Bitcoin', 'Ethereum', 'Other Crypto'],
            datasets: [{
                label: 'Cryptocurrency $',
                data: [bitcoin, ethereum, other_crypto],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
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

function line_chart_cash(hard_cash, dates, checkings, savings, other_cash) {   
    const ctx = document.getElementById('myChart_cash')
     const myChart7 = new Chart(ctx, {
         
         type: 'line',
         data: {
             labels: dates,
             datasets: [{
                 label: 'Hard Cash',
                 data: hard_cash,
                 pointBackgroundColor:'rgba(1, 1, 1, 1)',
                 borderWidth: 1,
                 borderColor: 'rgba(1, 1, 1, 1)'
             },

             {
                label: 'Checkings',
                data: checkings,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'Savings',
                data: savings,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'Other Cash',
                data: other_cash,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },
        
        ]
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

function pie_chart_cash(hard_cash, checkings, savings, other_cash) {

    const ctx_3 = document.getElementById('pie_cash')
    const myChart8 = new Chart(ctx_3, {
        
        type: 'pie',
        data: {
            labels: ['Hard Cash', 'Checkings', 'Savings', 'Other Cash'],
            datasets: [{
                label: 'Cash $',
                data: [hard_cash, checkings, savings, other_cash],
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

function line_chart_personal(principal_residence, dates, auto, other_properties, goods) {   
    const ctx = document.getElementById('myChart_personal')
     const myChart9 = new Chart(ctx, {
         
         type: 'line',
         data: {
             labels: dates,
             datasets: [{
                 label: 'Principal Residence',
                 data: principal_residence,
                 pointBackgroundColor:'rgba(1, 1, 1, 1)',
                 borderWidth: 1,
                 borderColor: 'rgba(1, 1, 1, 1)'
             },

             {
                label: 'Auto',
                data: auto,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'Other Properties',
                data: other_properties,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'Physical Goods',
                data: goods,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },
        
        ]
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

function pie_chart_personal(principal_residence, auto, other_properties, goods) {

    const ctx_3 = document.getElementById('pie_personal')
    const myChart10 = new Chart(ctx_3, {
        
        type: 'pie',
        data: {
            labels: ['Principal Residence', 'Auto', 'Other Properties', 'Goods'],
            datasets: [{
                label: 'Personal Assets $',
                data: [principal_residence, auto, other_properties, goods],
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

function line_chart_liability(mortgages, dates, consumer_debt, loans, other_debt) {   
    const ctx = document.getElementById('myChart_liability')
     const myChart11 = new Chart(ctx, {
         
         type: 'line',
         data: {
             labels: dates,
             datasets: [{
                 label: 'Mortgages',
                 data: mortgages,
                 pointBackgroundColor:'rgba(1, 1, 1, 1)',
                 borderWidth: 1,
                 borderColor: 'rgba(1, 1, 1, 1)'
             },

             {
                label: 'Consumer Debt',
                data: consumer_debt,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'Loans',
                data: loans,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },

            {
                label: 'Other Debt',
                data: other_debt,
                pointBackgroundColor:'rgba(1, 1, 1, 1)',
                borderWidth: 1,
                borderColor: 'rgba(1, 1, 1, 1)'
            },
        
        ]
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

function pie_chart_liability(mortgages, consumer_debt, loans, other_debt) {

    const ctx_3 = document.getElementById('pie_liability')
    const myChart12 = new Chart(ctx_3, {
        
        type: 'pie',
        data: {
            labels: ['Mortages', 'Consumer Debt', 'Loans', 'Other Debt'],
            datasets: [{
                label: 'Liabilities $',
                data: [mortgages, consumer_debt, loans, other_debt],
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



