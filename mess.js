// API Call to get entry data for the logged in user
fetch('/dashboard') 
.then(response => response.json())
.then(entries => {
    
    //sorts entries by date (chronological) - this is incase a user changes a date of an entry to be earlier/later...
    entries.sort(function(entries,b) {
        return new Date(entries.date) - new Date(b.date)
    })

    //used for calculation that need ALL entry sets. Entries below is cut into a set of 10 for table.
    let all_entries = entries;

    //get most recent entry
    var newest_entry = (entries[entries.length-1]);
    
    //sum each category for charts
    var total_liability = +newest_entry.principal_residence + +newest_entry.auto + +newest_entry.other_properties + +newest_entry.goods;
    var principal_residence = newest_entry.principal_residence;
    var auto = newest_entry.auto;
    var other_properties = newest_entry.other_properties;
    var goods = newest_entry.goods;


    // Print out total networth on dashboard

    document.querySelector("#principal_residence_dashboard").innerHTML = `$ ${principal_residence}`;
    document.querySelector("#auto_dashboard").innerHTML = `$ ${auto}`;
    document.querySelector("#other_properties_dashboard").innerHTML = `$ ${other_properties}`;
    document.querySelector("#goods_dashboard").innerHTML = `$ ${goods}`;
    document.querySelector("#total_liability_dashboard").innerHTML = `$ ${total_liability.toFixed(2)}`;
    

    pie_chart_personal(principal_residence, auto, other_properties, goods);


    //default start/end dates based on entries
    document.querySelector('#startdate').value = entries[0].date
    document.querySelector('#enddate').value = entries[entries.length-1].date

    const principal_residence_array = []
    const auto_array = []
    const other_properties_array = []
    const goods_array = []
    const dates_array = []

    for (let i=0; i < entries.length; i++) {

        principal_residence_array.push(entries[i].principal_residence);
        auto_array.push(entries[i].auto);
        other_properties_array.push(entries[i].other_properties);
        goods_array.push(entries[i].goods);
        dates_array.push(entries[i].date);
    }

    line_chart_personal(principal_residence_array, dates_array, auto_array, other_properties_array, goods_array);

    const max_length = 10;

    //adds button to see all entries if needed
    if (entries.length > max_length) {

        const button = document.createElement('button');
        button.innerHTML = "View all entries";
        
        document.querySelector('.personal-data-button').append(button);
        button.onclick = all_entries;

    };

    entries = entries.reverse()
    entries = entries.slice(0, max_length)
    entries = entries.reverse()


    //for Table
    for (let i=0; i < entries.length; i++) {

        //put each entry in both entry table
        entries.forEach((entry, id) => {

    

            var table = document.querySelector(".personal-table");

            var rows = table.rows.length

            //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
            if (rows >= entries.length + 2) {
                return;
            }
            
            var row = table.insertRow(2);
            
            var date = row.insertCell(0);
            var principal_residence = row.insertCell(1);
            var auto = row.insertCell(2);
            var other_properties = row.insertCell(3);
            var goods = row.insertCell(4);

            var cell_networth = row.insertCell(5);
            var total_change = row.insertCell(6);
            var percent_change = row.insertCell(7);


            date.innerHTML = entry.date;

            principal_residence.innerHTML = numberWithCommas(entry.principal_residence);
            auto.innerHTML = numberWithCommas(entry.auto);
            other_properties.innerHTML = numberWithCommas(entry.other_properties);
            goods.innerHTML = numberWithCommas(entry.goods);

            cell_networth.innerHTML = numberWithCommas(entry.total_liability);

            // if there are 10 or less entries total
            if (all_entries.length <= max_length) {
                        

                // if last element (if dont assign 0, it will not work)
                if (id == 0) {
                    percent_change.innerHTML = 0;
                    total_change.innerHTML = 0;
                    total_change_calc = 0;
                }
                // if not last entry
                else {
            
                    if (isNaN((entries[id].total_liability - entries[id-1].total_liability) / entries[id-1].total_liability) || !isFinite((entries[id].total_liability - entries[id-1].total_liability) / entries[id-1].total_liability) ){
                        percent_change.innerHTML = "n/a"
                    }
                    else {
                        percent_change.innerHTML += `${((entries[id].total_liability - entries[id-1].total_liability) / entries[id-1].total_liability).toFixed(2) * 100}%`;
            
            
                    }
            
                
                    //adds a + symbol infront of positive integers
                    if ((entries[id].total_liability - entries[id-1].total_liability) > 0) {
                    total_change_calc = (entries[id].total_liability - entries[id-1].total_liability)
                    total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                    }
            
                    else {
                        total_change_calc = (entries[id].total_liability - entries[id-1].total_liability)
                        total_change.innerHTML = total_change_calc.toLocaleString();
                    }
                }
            }
            
                // if there are more than 10 entries (the reason for this, is due to the 1st entry at the bottom of the table, 
                // its "Change since Last", needs to calculate based on previous value which is out of the table) Here we use all_entries NOT entries
            else {
            
                if (id == 0) {
            
                    if (isNaN((all_entries[9].total_liability - all_entries[10].total_liability) / all_entries[10].total_liability) || !isFinite((all_entries[9].total_liability - all_entries[10].total_liability) / all_entries[10].total_liability) ){
                        percent_change.innerHTML = "n/a"
                    }
                    else {
                        percent_change.innerHTML += `${((all_entries[9].total_liability - all_entries[10].total_liability) / all_entries[10].total_liability).toFixed(2) * 100}%`;
                    }
            
                    if ((all_entries[9].total_liability - all_entries[10].total_liability) > 0) {
                        total_change_calc = (all_entries[9].total_liability - all_entries[10].total_liability)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
            
                    else {
                        total_change_calc = (all_entries[9].total_liability - all_entries[10].total_liability)
                        total_change.innerHTML = total_change_calc.toLocaleString();
                    }
            
                }
            
                else {
            
                    
                    console.log("hey")
                    if (isNaN((entries[id].total_liability - entries[id-1].total_liability) / entries[id-1].total_liability) || !isFinite((entries[id].total_liability - entries[id-1].total_liability) / entries[id-1].total_liability) ){
                        percent_change.innerHTML = "n/a"
                    }
                    else {
                        percent_change.innerHTML += `${((entries[id].total_liability - entries[id-1].total_liability) / entries[id-1].total_liability).toFixed(2) * 100}%`;
                    }
            
                
                    //adds a + symbol infront of positive integers
                    if ((entries[id].total_liability - entries[id-1].total_liability) > 0) {
                    total_change_calc = (entries[id].total_liability - entries[id-1].total_liability)
                    total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                    }
            
                    else {
                        total_change_calc = (entries[id].total_liability - entries[id-1].total_liability)
                        total_change.innerHTML = total_change_calc.toLocaleString();
                    }
                }
                
            }


            // changes the colour of the border depending on value
            if (percent_change.innerHTML[0] == '-') {
                percent_change.style.backgroundColor = "#ff7782";
                total_change.style.backgroundColor = "#ff7782"
            }
            else if (total_change.innerHTML[0] == '0' ) {
                
            }
            else {
                percent_change.style.backgroundColor = "#41f1b6";
                total_change.style.backgroundColor = "#41f1b6";
            }

        });

        
    }

        // Infographic print out
        // Average Period Increase

        average_period_increase = (all_entries[0].total_liability / all_entries.length).toFixed(2)
        average_period_increase = numberWithCommas(average_period_increase)
        document.querySelector("#average_period_personal").innerHTML = `$ ${average_period_increase}`;

        // Amount Change Dashboard
        var yes = (all_entries[0].total_liability - all_entries[all_entries.length - 1].total_liability).toFixed(2);
        document.querySelector("#amount_change_personal").innerHTML = `$ ${yes}`


    })  