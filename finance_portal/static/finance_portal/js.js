document.addEventListener('DOMContentLoaded', function() {

    //buttons used to toggle between views

    document.querySelector('.dashboard').addEventListener('click', dashboard);
    document.querySelector('.investable-assets').addEventListener('click', investable_assets);
    document.querySelector('.crypto').addEventListener('click', crypto);
    document.querySelector('.cash').addEventListener('click', cash);
    document.querySelector('.personal-assets').addEventListener('click', personal_assets);
    document.querySelector('.liabilities').addEventListener('click', liability);
    document.querySelector('.add').addEventListener('click', add_entry);
    document.querySelector('.all-entries').addEventListener('click', all_entries);
    document.querySelector('#compose-form').addEventListener('submit', submit_entry);

    dashboard();

});





const sidebar = document.querySelector('.sidebar');

const children = sidebar.querySelectorAll(':scope > div');


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function investable_assets() {

    document.querySelector(".investable-view").style.display = "block";
    document.querySelector('.entry-view').style.display = "none";
    document.querySelector('.entries-view').style.display = "none";
    document.querySelector(".dashboard-view").style.display = "none";
    document.querySelector(".crypto-view").style.display = "none";
    document.querySelector(".cash-view").style.display = "none";
    document.querySelector(".personal-assets-view").style.display = "none";
    document.querySelector(".liability-view").style.display = "none";    

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
        var total_investable = +newest_entry.taxable + +newest_entry.tfsa + +newest_entry.rrsp + +newest_entry.other_investable;
        var taxable = newest_entry.taxable;
        var tfsa = newest_entry.tfsa;
        var rrsp = newest_entry.rrsp;
        var other_investable = newest_entry.other_investable;


        // Print out total networth on dashboard

        document.querySelector("#taxable_dashboard").innerHTML = `$ ${taxable}`;
        document.querySelector("#tfsa_dashboard").innerHTML = `$ ${tfsa}`;
        document.querySelector("#rrsp_dashboard").innerHTML = `$ ${rrsp}`;
        document.querySelector("#other_investable_dashboard").innerHTML = `$ ${other_investable}`;
        document.querySelector("#total_investable_dashboard").innerHTML = `$ ${total_investable.toFixed(2)}`;
        

        pie_chart_investable(taxable, tfsa, rrsp, other_investable);


        //default start/end dates based on entries
        document.querySelector('#startdate').value = entries[0].date
        document.querySelector('#enddate').value = entries[entries.length-1].date

        const taxable_array = []
        const tfsa_array = []
        const rrsp_array = []
        const other_investable_array = []
        const dates_array = []

        for (let i=0; i < entries.length; i++) {

            taxable_array.push(entries[i].taxable);
            tfsa_array.push(entries[i].tfsa);
            rrsp_array.push(entries[i].rrsp);
            other_investable_array.push(entries[i].other_investable);
            dates_array.push(entries[i].date);
        }


        line_chart_investable(taxable_array, dates_array, tfsa_array, rrsp_array, other_investable_array);

        var total_change_sum = 0;

        const max_length = 10;

        //adds button to see all entries if needed
        if (entries.length > max_length) {

            e="investable"
            addButton(e)

        };

        entries = entries.reverse()
        entries = entries.slice(0, max_length)
        entries = entries.reverse()


        //for Table
        for (let i=0; i < entries.length; i++) {

            //put each entry in both entry table
            entries.forEach((entry, id) => {

     

                var table = document.querySelector(".investable-table");

                var rows = table.rows.length

                //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
                if (rows >= entries.length + 2) {
                    return;
                }
                
                var row = table.insertRow(2);
                
                var date = row.insertCell(0);
                var taxable = row.insertCell(1);
                var tfsa = row.insertCell(2);
                var rrsp = row.insertCell(3);
                var other_investable = row.insertCell(4);


                var cell_networth = row.insertCell(5);
                var total_change = row.insertCell(6);
                var percent_change = row.insertCell(7);


                date.innerHTML = entry.date;

                taxable.innerHTML = numberWithCommas(entry.taxable);
                tfsa.innerHTML = numberWithCommas(entry.tfsa);
                rrsp.innerHTML = numberWithCommas(entry.rrsp);
                other_investable.innerHTML = numberWithCommas(entry.other_investable);


                cell_networth.innerHTML = numberWithCommas(entry.total_investable);

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

                        if (isNaN((entries[id].total_investable - entries[id-1].total_investable) / entries[id-1].total_investable) || !isFinite((entries[id].total_investable - entries[id-1].total_investable) / entries[id-1].total_investable) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_investable - entries[id-1].total_investable) / entries[id-1].total_investable).toFixed(2) * 100}%`;


                        }

                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_investable - entries[id-1].total_investable) > 0) {
                        total_change_calc = (entries[id].total_investable - entries[id-1].total_investable)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }

                        else {
                            total_change_calc = (entries[id].total_investable - entries[id-1].total_investable)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                }

                 // if there are more than 10 entries (the reason for this, is due to the 1st entry at the bottom of the table, 
                 // its "Change since Last", needs to calculate based on previous value which is out of the table) Here we use all_entries NOT entries
                else {

                    if (id == 0) {

                        if (isNaN((all_entries[9].total_investable - all_entries[10].total_investable) / all_entries[10].total_investable) || !isFinite((all_entries[9].total_investable - all_entries[10].total_investable) / all_entries[10].total_investable) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((all_entries[9].total_investable - all_entries[10].total_investable) / all_entries[10].total_investable).toFixed(2) * 100}%`;
                        }

                        if ((all_entries[9].total_investable - all_entries[10].total_investable) > 0) {
                            total_change_calc = (all_entries[9].total_investable - all_entries[10].total_investable)
                            total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                            }
        
                        else {
                            total_change_calc = (all_entries[9].total_investable - all_entries[10].total_investable)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }

                    }

                    else {

                        
                        if (isNaN((entries[id].total_investable - entries[id-1].total_investable) / entries[id-1].total_investable) || !isFinite((entries[id].total_investable - entries[id-1].total_investable) / entries[id-1].total_investable) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_investable - entries[id-1].total_investable) / entries[id-1].total_investable).toFixed(2) * 100}%`;
                        }
    
                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_investable - entries[id-1].total_investable) > 0) {
                        total_change_calc = (entries[id].total_investable - entries[id-1].total_investable)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
    
                        else {
                            total_change_calc = (entries[id].total_investable - entries[id-1].total_investable)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                    
                }


                // changes the colour of the border depending on value
                if (total_change.innerHTML[0]  == '-') {
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

            average_period_increase = (all_entries[0].total_investable / all_entries.length).toFixed(2)
            average_period_increase = numberWithCommas(average_period_increase)
            document.querySelector("#average_period_investable").innerHTML = `$ ${average_period_increase}`;
    
            // Amount Change Dashboard
            var yes = (all_entries[0].total_investable - all_entries[all_entries.length - 1].total_investable).toFixed(2);
            document.querySelector("#amount_change_investable").innerHTML = `$ ${yes}`


        })  

}

function crypto() {

    document.querySelector(".crypto-view").style.display = "block";
    document.querySelector('.entry-view').style.display = "none";
    document.querySelector('.entries-view').style.display = "none";
    document.querySelector(".dashboard-view").style.display = "none";
    document.querySelector(".investable-view").style.display = "none";
    document.querySelector(".cash-view").style.display = "none";
    document.querySelector(".personal-assets-view").style.display = "none";
    document.querySelector(".liability-view").style.display = "none";
    
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
        var total_crypto = +newest_entry.bitcoin + +newest_entry.ethereum + +newest_entry.other_crypto;
        var bitcoin = newest_entry.bitcoin;
        var ethereum = newest_entry.ethereum;
        var other_crypto = newest_entry.other_crypto;


        // Print out total networth on dashboard

        document.querySelector("#bitcoin_dashboard").innerHTML = `$ ${bitcoin}`;
        document.querySelector("#ethereum_dashboard").innerHTML = `$ ${ethereum}`;
        document.querySelector("#other_crypto_dashboard").innerHTML = `$ ${other_crypto}`;
        document.querySelector("#total_crypto_dashboard").innerHTML = `$ ${total_crypto.toFixed(2)}`;
        

        pie_chart_crypto(bitcoin, ethereum, other_crypto);


        //default start/end dates based on entries
        document.querySelector('#startdate').value = entries[0].date
        document.querySelector('#enddate').value = entries[entries.length-1].date

        const bitcoin_array = []
        const ethereum_array = []
        const other_crypto_array = []
        const dates_array = []

        for (let i=0; i < entries.length; i++) {

            bitcoin_array.push(entries[i].bitcoin);
            ethereum_array.push(entries[i].ethereum);
            other_crypto_array.push(entries[i].other_crypto);
            dates_array.push(entries[i].date);
        }

        line_chart_crypto(bitcoin_array, dates_array, ethereum_array, other_crypto_array);

        const max_length = 10;

        //adds button to see all entries if needed
        if (entries.length > max_length) {

            e="crypto"
            addButton(e)
        };

        entries = entries.reverse()
        entries = entries.slice(0, max_length)
        entries = entries.reverse()


        //for Table
        for (let i=0; i < entries.length; i++) {

            //put each entry in both entry table
            entries.forEach((entry, id) => {

        

                var table = document.querySelector(".crypto-table");

                var rows = table.rows.length

                //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
                if (rows >= entries.length + 2) {
                    return;
                }
                
                var row = table.insertRow(2);
                
                var date = row.insertCell(0);
                var bitcoin = row.insertCell(1);
                var ethereum = row.insertCell(2);
                var other_crypto = row.insertCell(3);

                var cell_networth = row.insertCell(4);
                var total_change = row.insertCell(5);
                var percent_change = row.insertCell(6);


                date.innerHTML = entry.date;

                bitcoin.innerHTML = numberWithCommas(entry.bitcoin);
                ethereum.innerHTML = numberWithCommas(entry.ethereum);
                other_crypto.innerHTML = numberWithCommas(entry.other_crypto);

                cell_networth.innerHTML = numberWithCommas(entry.total_crypto);

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
                
                        if (isNaN((entries[id].total_crypto - entries[id-1].total_crypto) / entries[id-1].total_crypto) || !isFinite((entries[id].total_crypto - entries[id-1].total_crypto) / entries[id-1].total_crypto) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_crypto - entries[id-1].total_crypto) / entries[id-1].total_crypto).toFixed(2) * 100}%`;
                
                
                        }
                
                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_crypto - entries[id-1].total_crypto) > 0) {
                        total_change_calc = (entries[id].total_crypto - entries[id-1].total_crypto)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
                
                        else {
                            total_change_calc = (entries[id].total_crypto - entries[id-1].total_crypto)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                }
                
                    // if there are more than 10 entries (the reason for this, is due to the 1st entry at the bottom of the table, 
                    // its "Change since Last", needs to calculate based on previous value which is out of the table) Here we use all_entries NOT entries
                else {
                
                    if (id == 0) {
                
                        if (isNaN((all_entries[9].total_crypto - all_entries[10].total_crypto) / all_entries[10].total_crypto) || !isFinite((all_entries[9].total_crypto - all_entries[10].total_crypto) / all_entries[10].total_crypto) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((all_entries[9].total_crypto - all_entries[10].total_crypto) / all_entries[10].total_crypto).toFixed(2) * 100}%`;
                        }
                
                        if ((all_entries[9].total_crypto - all_entries[10].total_crypto) > 0) {
                            total_change_calc = (all_entries[9].total_crypto - all_entries[10].total_crypto)
                            total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                            }
                
                        else {
                            total_change_calc = (all_entries[9].total_crypto - all_entries[10].total_crypto)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                
                    }
                
                    else {
                

                        if (isNaN((entries[id].total_crypto - entries[id-1].total_crypto) / entries[id-1].total_crypto) || !isFinite((entries[id].total_crypto - entries[id-1].total_crypto) / entries[id-1].total_crypto) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_crypto - entries[id-1].total_crypto) / entries[id-1].total_crypto).toFixed(2) * 100}%`;
                        }
                
                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_crypto - entries[id-1].total_crypto) > 0) {
                        total_change_calc = (entries[id].total_crypto - entries[id-1].total_crypto)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
                
                        else {
                            total_change_calc = (entries[id].total_crypto - entries[id-1].total_crypto)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                    
                }


                // changes the colour of the border depending on value
                if (total_change.innerHTML[0]  == '-') {
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

            average_period_increase = (all_entries[0].total_crypto / all_entries.length).toFixed(2)
            average_period_increase = numberWithCommas(average_period_increase)
            document.querySelector("#average_period_crypto").innerHTML = `$ ${average_period_increase}`;
    
            // Amount Change Dashboard
            var yes = (all_entries[0].total_crypto - all_entries[all_entries.length - 1].total_crypto).toFixed(2);
            document.querySelector("#amount_change_crypto").innerHTML = `$ ${yes}`


        })  

}

function cash() {

    document.querySelector(".cash-view").style.display = "block";
    document.querySelector(".crypto-view").style.display = "none";
    document.querySelector('.entry-view').style.display = "none";
    document.querySelector('.entries-view').style.display = "none";
    document.querySelector(".dashboard-view").style.display = "none";
    document.querySelector(".investable-view").style.display = "none";
    document.querySelector(".personal-assets-view").style.display = "none";
    document.querySelector(".liability-view").style.display = "none";
    
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
        var total_cash = +newest_entry.hard_cash + +newest_entry.checkings + +newest_entry.savings + +newest_entry.other_cash;
        var hard_cash = newest_entry.hard_cash;
        var checkings = newest_entry.checkings;
        var savings = newest_entry.savings;
        var other_cash = newest_entry.other_cash;


        // Print out total networth on dashboard

        document.querySelector("#hard_cash_dashboard").innerHTML = `$ ${hard_cash}`;
        document.querySelector("#checkings_dashboard").innerHTML = `$ ${checkings}`;
        document.querySelector("#savings_dashboard").innerHTML = `$ ${savings}`;
        document.querySelector("#other_cash_dashboard").innerHTML = `$ ${other_cash}`;
        document.querySelector("#total_cash_dashboard").innerHTML = `$ ${total_cash.toFixed(2)}`;
        

        pie_chart_cash(hard_cash, checkings, savings, other_cash);


        //default start/end dates based on entries
        document.querySelector('#startdate').value = entries[0].date
        document.querySelector('#enddate').value = entries[entries.length-1].date

        const hard_cash_array = []
        const checkings_array = []
        const savings_array = []
        const other_cash_array = []
        const dates_array = []

        for (let i=0; i < entries.length; i++) {

            hard_cash_array.push(entries[i].hard_cash);
            checkings_array.push(entries[i].checkings);
            savings_array.push(entries[i].savings);
            other_cash_array.push(entries[i].other_cash);
            dates_array.push(entries[i].date);
        }

        line_chart_cash(hard_cash_array, dates_array, checkings_array, savings_array, other_cash_array);

        const max_length = 10;

        //adds button to see all entries if needed
        if (entries.length > max_length) {

            e="cash"
            addButton(e)

        };

        entries = entries.reverse()
        entries = entries.slice(0, max_length)
        entries = entries.reverse()


        //for Table
        for (let i=0; i < entries.length; i++) {

            //put each entry in both entry table
            entries.forEach((entry, id) => {

        

                var table = document.querySelector(".cash-table");

                var rows = table.rows.length

                //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
                if (rows >= entries.length + 2) {
                    return;
                }
                
                var row = table.insertRow(2);
                
                var date = row.insertCell(0);
                var hard_cash = row.insertCell(1);
                var checkings = row.insertCell(2);
                var savings = row.insertCell(3);
                var other_cash = row.insertCell(4);

                var cell_networth = row.insertCell(5);
                var total_change = row.insertCell(6);
                var percent_change = row.insertCell(7);


                date.innerHTML = entry.date;

                hard_cash.innerHTML = numberWithCommas(entry.hard_cash);
                checkings.innerHTML = numberWithCommas(entry.checkings);
                savings.innerHTML = numberWithCommas(entry.savings);
                other_cash.innerHTML = numberWithCommas(entry.other_cash);

                cell_networth.innerHTML = numberWithCommas(entry.total_cash);

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
                
                        if (isNaN((entries[id].total_cash - entries[id-1].total_cash) / entries[id-1].total_cash) || !isFinite((entries[id].total_cash - entries[id-1].total_cash) / entries[id-1].total_cash) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_cash - entries[id-1].total_cash) / entries[id-1].total_cash).toFixed(2) * 100}%`;
                
                
                        }
                
                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_cash - entries[id-1].total_cash) > 0) {
                        total_change_calc = (entries[id].total_cash - entries[id-1].total_cash)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
                
                        else {
                            total_change_calc = (entries[id].total_cash - entries[id-1].total_cash)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                }
                
                    // if there are more than 10 entries (the reason for this, is due to the 1st entry at the bottom of the table, 
                    // its "Change since Last", needs to calculate based on previous value which is out of the table) Here we use all_entries NOT entries
                else {
                
                    if (id == 0) {
                
                        if (isNaN((all_entries[9].total_cash - all_entries[10].total_cash) / all_entries[10].total_cash) || !isFinite((all_entries[9].total_cash - all_entries[10].total_cash) / all_entries[10].total_cash) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((all_entries[9].total_cash - all_entries[10].total_cash) / all_entries[10].total_cash).toFixed(2) * 100}%`;
                        }
                
                        if ((all_entries[9].total_cash - all_entries[10].total_cash) > 0) {
                            total_change_calc = (all_entries[9].total_cash - all_entries[10].total_cash)
                            total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                            }
                
                        else {
                            total_change_calc = (all_entries[9].total_cash - all_entries[10].total_cash)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                
                    }
                
                    else {
                
                        if (isNaN((entries[id].total_cash - entries[id-1].total_cash) / entries[id-1].total_cash) || !isFinite((entries[id].total_cash - entries[id-1].total_cash) / entries[id-1].total_cash) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_cash - entries[id-1].total_cash) / entries[id-1].total_cash).toFixed(2) * 100}%`;
                        }
                
                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_cash - entries[id-1].total_cash) > 0) {
                        total_change_calc = (entries[id].total_cash - entries[id-1].total_cash)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
                
                        else {
                            total_change_calc = (entries[id].total_cash - entries[id-1].total_cash)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                    
                }


                // changes the colour of the border depending on value
                if (total_change.innerHTML[0]  == '-') {
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

            average_period_increase = (all_entries[0].total_cash / all_entries.length).toFixed(2)
            average_period_increase = numberWithCommas(average_period_increase)
            document.querySelector("#average_period_cash").innerHTML = `$ ${average_period_increase}`;
    
            // Amount Change Dashboard
            var yes = (all_entries[0].total_cash - all_entries[all_entries.length - 1].total_cash).toFixed(2);
            document.querySelector("#amount_change_cash").innerHTML = `$ ${yes}`


        })  

}

function personal_assets() {

    document.querySelector(".personal-assets-view").style.display = "block";
    document.querySelector(".crypto-view").style.display = "none";
    document.querySelector('.entry-view').style.display = "none";
    document.querySelector('.entries-view').style.display = "none";
    document.querySelector(".dashboard-view").style.display = "none";
    document.querySelector(".investable-view").style.display = "none";
    document.querySelector(".cash-view").style.display = "none";
    document.querySelector(".liability-view").style.display = "none";

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
        var total_personal = +newest_entry.principal_residence + +newest_entry.auto + +newest_entry.other_properties + +newest_entry.goods;
        var principal_residence = newest_entry.principal_residence;
        var auto = newest_entry.auto;
        var other_properties = newest_entry.other_properties;
        var goods = newest_entry.goods;


        // Print out total networth on dashboard

        document.querySelector("#principal_residence_dashboard").innerHTML = `$ ${principal_residence}`;
        document.querySelector("#auto_dashboard").innerHTML = `$ ${auto}`;
        document.querySelector("#other_properties_dashboard").innerHTML = `$ ${other_properties}`;
        document.querySelector("#goods_dashboard").innerHTML = `$ ${goods}`;
        document.querySelector("#total_personal_dashboard").innerHTML = `$ ${total_personal.toFixed(2)}`;
        

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

            e="personal"
            addButton(e)

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

                cell_networth.innerHTML = numberWithCommas(entry.total_personal);

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
                
                        if (isNaN((entries[id].total_personal - entries[id-1].total_personal) / entries[id-1].total_personal) || !isFinite((entries[id].total_personal - entries[id-1].total_personal) / entries[id-1].total_personal) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_personal - entries[id-1].total_personal) / entries[id-1].total_personal).toFixed(2) * 100}%`;
                
                
                        }
                
                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_personal - entries[id-1].total_personal) > 0) {
                        total_change_calc = (entries[id].total_personal - entries[id-1].total_personal)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
                
                        else {
                            total_change_calc = (entries[id].total_personal - entries[id-1].total_personal)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                }
                
                    // if there are more than 10 entries (the reason for this, is due to the 1st entry at the bottom of the table, 
                    // its "Change since Last", needs to calculate based on previous value which is out of the table) Here we use all_entries NOT entries
                else {
                
                    if (id == 0) {
                
                        if (isNaN((all_entries[9].total_personal - all_entries[10].total_personal) / all_entries[10].total_personal) || !isFinite((all_entries[9].total_personal - all_entries[10].total_personal) / all_entries[10].total_personal) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((all_entries[9].total_personal - all_entries[10].total_personal) / all_entries[10].total_personal).toFixed(2) * 100}%`;
                        }
                
                        if ((all_entries[9].total_personal - all_entries[10].total_personal) > 0) {
                            total_change_calc = (all_entries[9].total_personal - all_entries[10].total_personal)
                            total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                            }
                
                        else {
                            total_change_calc = (all_entries[9].total_personal - all_entries[10].total_personal)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                
                    }
                
                    else {
                
                
                        if (isNaN((entries[id].total_personal - entries[id-1].total_personal) / entries[id-1].total_personal) || !isFinite((entries[id].total_personal - entries[id-1].total_personal) / entries[id-1].total_personal) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_personal - entries[id-1].total_personal) / entries[id-1].total_personal).toFixed(2) * 100}%`;
                        }
                
                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_personal - entries[id-1].total_personal) > 0) {
                        total_change_calc = (entries[id].total_personal - entries[id-1].total_personal)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
                
                        else {
                            total_change_calc = (entries[id].total_personal - entries[id-1].total_personal)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                    
                }

                // changes the colour of the border depending on value
                if (total_change.innerHTML[0]  == '-') {
                    percent_change.style.backgroundColor = "#ff7782";
                    total_change.style.backgroundColor = "#ff7782"
                }
                else if (total_change.innerHTML[0] == '0' ) {
                    
                }
                else {
                    percent_change.style.backgroundColor = "#41f1b6";
                    total_change.style.backgroundColor = "#41f1b6";
                }

            })
            
        }

            // Infographic print out
            // Average Period Increase

            average_period_increase = (all_entries[0].total_personal / all_entries.length).toFixed(2)
            average_period_increase = numberWithCommas(average_period_increase)
            document.querySelector("#average_period_personal").innerHTML = `$ ${average_period_increase}`;

            // Amount Change Dashboard
            var yes = (all_entries[0].total_personal - all_entries[all_entries.length - 1].total_personal).toFixed(2);
            document.querySelector("#amount_change_personal").innerHTML = `$ ${yes}`


        })  
    
}

function liability() {

    document.querySelector(".liability-view").style.display = "block";
    document.querySelector(".crypto-view").style.display = "none";
    document.querySelector('.entry-view').style.display = "none";
    document.querySelector('.entries-view').style.display = "none";
    document.querySelector(".dashboard-view").style.display = "none";
    document.querySelector(".investable-view").style.display = "none";
    document.querySelector(".cash-view").style.display = "none";
    document.querySelector(".personal-assets-view").style.display = "none";     

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
        var total_liability = +newest_entry.mortgages + +newest_entry.consumer_debt + +newest_entry.loans + +newest_entry.other_debt;
        var mortgages = newest_entry.mortgages;
        var consumer_debt = newest_entry.consumer_debt;
        var loans = newest_entry.loans;
        var other_debt = newest_entry.other_debt;


        // Print out total networth on dashboard

        document.querySelector("#mortgage_dashboard").innerHTML = `$ ${mortgages}`;
        document.querySelector("#consumer_debt_dashboard").innerHTML = `$ ${consumer_debt}`;
        document.querySelector("#loan_dashboard").innerHTML = `$ ${loans}`;
        document.querySelector("#other_debt_dashboard").innerHTML = `$ ${other_debt}`;
        document.querySelector("#total_liability_dashboard").innerHTML = `$ ${total_liability.toFixed(2)}`;
        
        pie_chart_liability(mortgages, consumer_debt, loans, other_debt);

        //default start/end dates based on entries
        document.querySelector('#startdate').value = entries[0].date
        document.querySelector('#enddate').value = entries[entries.length-1].date

        const mortgages_array = []
        const consumer_debt_array = []
        const loans_array = []
        const other_debt_array = []
        const dates_array = []

        for (let i=0; i < entries.length; i++) {

            mortgages_array.push(entries[i].mortgages);
            consumer_debt_array.push(entries[i].consumer_debt);
            loans_array.push(entries[i].loans);
            other_debt_array.push(entries[i].other_debt);
            dates_array.push(entries[i].date);
        }

        line_chart_liability(mortgages_array, dates_array, consumer_debt_array, loans_array, other_debt_array);

        const max_length = 10;

        //adds button to see all entries if needed
        if (entries.length > max_length) {

            e="liability"
            addButton(e)

        };

        entries = entries.reverse()
        entries = entries.slice(0, max_length)
        entries = entries.reverse()


        //for Table
        for (let i=0; i < entries.length; i++) {

            //put each entry in both entry table
            entries.forEach((entry, id) => {

                var table = document.querySelector(".liability-table");

                var rows = table.rows.length

                //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
                if (rows >= entries.length + 2) {
                    return;
                }
                
                var row = table.insertRow(2);
                
                var date = row.insertCell(0);
                var mortgages = row.insertCell(1);
                var consumer_debt = row.insertCell(2);
                var loans = row.insertCell(3);
                var other_debt = row.insertCell(4);

                var cell_networth = row.insertCell(5);
                var total_change = row.insertCell(6);
                var percent_change = row.insertCell(7);


                date.innerHTML = entry.date;

                mortgages.innerHTML = numberWithCommas(entry.mortgages);
                consumer_debt.innerHTML = numberWithCommas(entry.consumer_debt);
                loans.innerHTML = numberWithCommas(entry.loans);
                other_debt.innerHTML = numberWithCommas(entry.other_debt);

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
                if (total_change.innerHTML[0]  == '-') {
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
            document.querySelector("#average_period_liability").innerHTML = `$ ${average_period_increase}`;

            // Amount Change Dashboard
            var yes = (all_entries[0].total_liability - all_entries[all_entries.length - 1].total_liability).toFixed(2);
            document.querySelector("#amount_change_liability").innerHTML = `$ ${yes}`


        })  

}

function dashboard() {

    document.querySelector(".dashboard-view").style.display = "block";
    document.querySelector('.entry-view').style.display = "none";
    document.querySelector('.entries-view').style.display = "none";
    document.querySelector(".investable-view").style.display = "none";
    document.querySelector(".crypto-view").style.display = "none";
    document.querySelector(".cash-view").style.display = "none";
    document.querySelector(".personal-assets-view").style.display = "none";
    document.querySelector(".liability-view").style.display = "none";  

    // API Call to get entry data for the logged in user
    fetch('/dashboard') 
    .then(response => response.json())
    .then(entries => {

        //sorts entries by date (chronological) - this is incase a user changes a date of an entry to be earlier/later...
        entries.sort(function(entries,b) {
            return new Date(entries.date) - new Date(b.date)
        })

        let all_entries = entries;

        //get most recent entry
        var newest_entry = (entries[entries.length-1]);


        //sum each category for charts
        var total_investable = +newest_entry.taxable + +newest_entry.tfsa + +newest_entry.rrsp + +newest_entry.other_investable;
        var total_crypto = +newest_entry.bitcoin + +newest_entry.ethereum + +newest_entry.other_crypto;
        var total_cash = +newest_entry.hard_cash + +newest_entry.checkings + +newest_entry.savings + +newest_entry.other_cash;  
        var total_personal_assets = +newest_entry.principal_residence + +newest_entry.auto + +newest_entry.other_properties + +newest_entry.goods;  
        var total_liabilities = +newest_entry.mortgages + +newest_entry.consumer_debt + +newest_entry.loans + +newest_entry.other_debt;

    
        //calculate recent net worth
        var networth = (total_investable + total_crypto + total_cash + total_personal_assets) - total_liabilities;

        // Print out total networth on dashboard
        document.querySelector("#networth_dashboard").innerHTML = `$ ${networth.toFixed(2)}`;
        document.querySelector("#investable_dashboard").innerHTML = `$ ${total_investable.toFixed(2)}`;
        document.querySelector("#crypto_dashboard").innerHTML = `$ ${total_crypto.toFixed(2)}`;
        document.querySelector("#cash_dashboard").innerHTML = `$ ${total_cash.toFixed(2)}`;
        document.querySelector("#personal_dashboard").innerHTML = `$ ${total_personal_assets.toFixed(2)}`;
        document.querySelector("#liabilities_dashboard").innerHTML = `$ ${total_liabilities.toFixed(2)}`;

        //update donut chart with recent values
        donut_chart(total_investable, total_crypto, total_cash, total_personal_assets);

        //default start/end dates based on entries
        document.querySelector('#startdate').value = entries[0].date
        document.querySelector('#enddate').value = entries[entries.length-1].date

        const networth_array = []
        const dates_array = []

        for (let i=0; i < entries.length; i++) {

            networth_array.push(entries[i].total_networth);
            dates_array.push(entries[i].date);

        }

        line_chart(networth_array, dates_array);

        const max_length = 10;

        //adds button to see all entries if needed
        if (entries.length > max_length) {

            e="dashboard"
            addButton(e)
        };


        entries = entries.reverse()
        entries = entries.slice(0, max_length)
        entries = entries.reverse()

        for (let i=0; i < entries.length; i++) {

            //put each entry in both entry table
            entries.forEach((entry, id) => {

                var table = document.querySelector(".dashboard-table");

                var rows = table.rows.length

                //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
                if (rows >= entries.length + 2) {
                    return;
                }
                
                var row = table.insertRow(2);
                
                var date = row.insertCell(0);
                var taxable = row.insertCell(1);
                var tfsa = row.insertCell(2);
                var rrsp = row.insertCell(3);
                var other_investable = row.insertCell(4);

                var bitcoin = row.insertCell(5);
                var ethereum = row.insertCell(6);
                var other_crypto = row.insertCell(7);

                var hard_cash = row.insertCell(8);
                var checkings = row.insertCell(9);
                var savings = row.insertCell(10);
                var other_cash = row.insertCell(11);

                var principal_residence = row.insertCell(12);
                var auto = row.insertCell(13);
                var other_properties = row.insertCell(14);
                var goods = row.insertCell(15);

                var mortgages = row.insertCell(16);
                var consumer_debt = row.insertCell(17);
                var loans = row.insertCell(18);
                var other_debt = row.insertCell(19);

                var cell_networth = row.insertCell(20);
                var total_change = row.insertCell(21);
                var percent_change = row.insertCell(22);


                date.innerHTML = entry.date;

                taxable.innerHTML = numberWithCommas(entry.taxable);
                tfsa.innerHTML = numberWithCommas(entry.tfsa);
                rrsp.innerHTML = numberWithCommas(entry.rrsp);
                other_investable.innerHTML = numberWithCommas(entry.other_investable);
                
                bitcoin.innerHTML = numberWithCommas(entry.bitcoin);
                ethereum.innerHTML = numberWithCommas(entry.ethereum);
                other_crypto.innerHTML = numberWithCommas(entry.other_crypto);

                hard_cash.innerHTML = numberWithCommas(entry.hard_cash);
                checkings.innerHTML = numberWithCommas(entry.checkings);
                savings.innerHTML = numberWithCommas(entry.savings);
                other_cash.innerHTML = numberWithCommas(entry.other_cash);

                principal_residence.innerHTML = numberWithCommas(entry.principal_residence);
                auto.innerHTML = numberWithCommas(entry.auto);
                other_properties.innerHTML = numberWithCommas(entry.other_properties);
                goods.innerHTML = numberWithCommas(entry.goods);

                mortgages.innerHTML = numberWithCommas(entry.mortgages);
                consumer_debt.innerHTML = numberWithCommas(entry.consumer_debt);
                loans.innerHTML = numberWithCommas(entry.loans);
                other_debt.innerHTML = numberWithCommas(entry.other_debt);

                cell_networth.innerHTML = numberWithCommas(entry.total_networth);

                if (all_entries.length <= max_length) {
                    // if last element (if dont assign 0, it will not work)
                    if (id == 0) {
                        percent_change.innerHTML = 0;
                        total_change.innerHTML = 0;
                        total_change_calc = 0;
                    }
                    // if not last entry
                    else {

                        if (isNaN((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth) || !isFinite((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth).toFixed(2) * 100}%`;
                        }

                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_networth - entries[id-1].total_networth) > 0) {
                        total_change_calc = (entries[id].total_networth - entries[id-1].total_networth)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }

                        else {
                            total_change_calc = (entries[id].total_networth - entries[id-1].total_networth)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                }

                else {

                    if (id == 0) {


                        if (isNaN((all_entries[9].total_networth - all_entries[10].total_networth) / all_entries[10].total_networth) || !isFinite((all_entries[9].total_networth - all_entries[10].total_networth) / all_entries[10].total_networth) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((all_entries[9].total_networth - all_entries[10].total_networth) / all_entries[10].total_networth).toFixed(2) * 100}%`;
                        }

                        if ((all_entries[9].total_networth - all_entries[10].total_networth) > 0) {
                            total_change_calc = (all_entries[9].total_networth - all_entries[10].total_networth)
                            total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                            }
        
                        else {
                            total_change_calc = (all_entries[9].total_networth - all_entries[10].total_networth)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }

                    }

                    else {
                        if (isNaN((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth) || !isFinite((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth) ){
                            percent_change.innerHTML = "n/a"
                        }
                        else {
                            percent_change.innerHTML += `${((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth).toFixed(3) * 100}%`;
                        }
    
                    
                        //adds a + symbol infront of positive integers
                        if ((entries[id].total_networth - entries[id-1].total_networth) > 0) {
                        total_change_calc = (entries[id].total_networth - entries[id-1].total_networth)
                        total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                        }
    
                        else {
                            total_change_calc = (entries[id].total_networth - entries[id-1].total_networth)
                            total_change.innerHTML = total_change_calc.toLocaleString();
                        }
                    }
                    
                }
                    
                // changes the colour of the border
                if (total_change.innerHTML[0] == '-') {
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

        average_period_increase = (all_entries[0].total_networth / all_entries.length).toFixed(2)
        average_period_increase = numberWithCommas(average_period_increase)
        document.querySelector("#average_period_dashboard").innerHTML = `$ ${average_period_increase}`;

        // Amount Change Dashboard
        var yes = (all_entries[0].total_networth - all_entries[all_entries.length - 1].total_networth).toFixed(2);
        document.querySelector("#amount_change_dashboard").innerHTML = `$ ${yes}`;


    })  

}

function addButton(e) {

    console.log(e, "okl")
    var button = document.createElement('button');
    button.innerHTML = "View all entries";
    button.classList.add("all-entries-btn");
    

    document.querySelector(`.${e}-data-button`).append(button);
    button.addEventListener('click', all_entries);

}

function add_entry() {

    document.querySelector('.entry-view').style.display = "block";
    document.querySelector('.dashboard-view').style.display = "none";
    document.querySelector('.entries-view').style.display = "none";
    document.querySelector(".investable-view").style.display = "none";
    document.querySelector(".crypto-view").style.display = "none";
    document.querySelector(".cash-view").style.display = "none";
    document.querySelector(".personal-assets-view").style.display = "none";
    document.querySelector(".liability-view").style.display = "none";  
}

function submit_entry() {
    fetch('/submit', {
        method: 'POST',
        body: JSON.stringify({
            tfsa: document.querySelector('.submit-tfsa').value,
            taxable: document.querySelector('.submit-taxable').value,
            rrsp: document.querySelector('.submit-rrsp').value,
            other_investable: document.querySelector('.submit-investment-other').value,

            bitcoin: document.querySelector('.submit-bitcoin').value,
            ethereum: document.querySelector('.submit-ethereum').value,
            other_crypto: document.querySelector('.submit-crypto-other').value,

            hard_cash: document.querySelector('.submit-hard-cash').value,
            checkings: document.querySelector('.submit-checking').value,
            savings: document.querySelector('.submit-savings').value,
            other_cash: document.querySelector('.submit-cash-other').value,

            principal_residence: document.querySelector('.submit-principal-residence').value,
            auto: document.querySelector('.submit-auto').value,
            other_properties: document.querySelector('.submit-properties-other').value,
            goods: document.querySelector('.submit-valuables').value,

            mortgages: document.querySelector('.submit-mortgages').value,
            consumer_debt: document.querySelector('.submit-consumer-debt').value,
            loans: document.querySelector('.submit-loans').value,
            other_debt: document.querySelector('.submit-debt-other').value
        })
    })
    .then(response => dashboard());

    return false;
}

function all_entries() {
    document.querySelector('.entries-view').style.display = "block";
    document.querySelector(".dashboard-view").style.display = "none";
    document.querySelector('.entry-view').style.display = "none";
    document.querySelector(".investable-view").style.display = "none";
    document.querySelector(".crypto-view").style.display = "none";
    document.querySelector(".cash-view").style.display = "none";
    document.querySelector(".personal-assets-view").style.display = "none";
    document.querySelector(".liability-view").style.display = "none";  

    fetch('/dashboard') 
    .then(response => response.json())
    .then(entries => {

        //sorts entries by date (chronological) - this is incase a user changes a date of an entry to be earlier/later...
        entries.sort(function(entries,b) {
            return new Date(entries.date) - new Date(b.date)
        })

        
        var total_change_sum = 0;

        //put each entry in both entry table
        entries.forEach((entry, id) => {

            var table = document.querySelector(".all-entries-table");

            var rows = table.rows.length

            //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
            if (rows >= entries.length + 2) {
                return;
            }
            
            var row = table.insertRow(2);
            
            var date = row.insertCell(0);
            var taxable = row.insertCell(1);
            var tfsa = row.insertCell(2);
            var rrsp = row.insertCell(3);
            var other_investable = row.insertCell(4);

            var bitcoin = row.insertCell(5);
            var ethereum = row.insertCell(6);
            var other_crypto = row.insertCell(7);

            var hard_cash = row.insertCell(8);
            var checkings = row.insertCell(9);
            var savings = row.insertCell(10);
            var other_cash = row.insertCell(11);

            var principal_residence = row.insertCell(12);
            var auto = row.insertCell(13);
            var other_properties = row.insertCell(14);
            var goods = row.insertCell(15);

            var mortgages = row.insertCell(16);
            var consumer_debt = row.insertCell(17);
            var loans = row.insertCell(18);
            var other_debt = row.insertCell(19);

            var cell_networth = row.insertCell(20);
            var total_change = row.insertCell(21);
            var percent_change = row.insertCell(22);
            
            date.innerHTML = entry.date;

            taxable.innerHTML = numberWithCommas(entry.taxable);
            tfsa.innerHTML = numberWithCommas(entry.tfsa);
            rrsp.innerHTML = numberWithCommas(entry.rrsp);
            other_investable.innerHTML = numberWithCommas(entry.other_investable);
            
            bitcoin.innerHTML = numberWithCommas(entry.bitcoin);
            ethereum.innerHTML = numberWithCommas(entry.ethereum);
            other_crypto.innerHTML = numberWithCommas(entry.other_crypto);

            hard_cash.innerHTML = numberWithCommas(entry.hard_cash);
            checkings.innerHTML = numberWithCommas(entry.checkings);
            savings.innerHTML = numberWithCommas(entry.savings);
            other_cash.innerHTML = numberWithCommas(entry.other_cash);

            principal_residence.innerHTML = numberWithCommas(entry.principal_residence);
            auto.innerHTML = numberWithCommas(entry.auto);
            other_properties.innerHTML = numberWithCommas(entry.other_properties);
            goods.innerHTML = numberWithCommas(entry.goods);

            mortgages.innerHTML = numberWithCommas(entry.mortgages);
            consumer_debt.innerHTML = numberWithCommas(entry.consumer_debt);
            loans.innerHTML = numberWithCommas(entry.loans);
            other_debt.innerHTML = numberWithCommas(entry.other_debt);

            cell_networth.innerHTML = numberWithCommas(entry.total_networth);

            // if last element (if dont assign 0, it will not work)
            if (id == 0) {
                percent_change.innerHTML = 0;
                total_change.innerHTML = 0;
                total_change_calc = 0;
            }
            // if not last entry
            else {

                if (isNaN((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth) || !isFinite((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth) ){
                    percent_change.innerHTML = "n/a"
                }
                else {
                    percent_change.innerHTML += `${((entries[id].total_networth - entries[id-1].total_networth) / entries[id-1].total_networth).toFixed(3) * 100}%`;
                }
            
                //adds a + symbol infront of positive integers
                if ((entries[id].total_networth - entries[id-1].total_networth) > 0) {
                var total_change_calc = (entries[id].total_networth - entries[id-1].total_networth)
                total_change.innerHTML += `+ ${total_change_calc.toLocaleString()}`;
                }

                else {
                    var total_change_calc = (entries[id].total_networth - entries[id-1].total_networth)
                    total_change.innerHTML = total_change_calc.toLocaleString();
                }
            }

            // changes the colour of the border
            if (total_change.innerHTML[0]  == '-') {
                percent_change.style.backgroundColor = "#ff7782";
                total_change.style.backgroundColor = "#ff7782"
            }
            else if (total_change.innerHTML[0] == '0' ) {
                
            }
            else {
                percent_change.style.backgroundColor = "#41f1b6";
                total_change.style.backgroundColor = "#41f1b6";
            }

            // calculation for dashboard Average Period Increase in infographic
            total_change_sum += (total_change_calc);
        });

    })  

}



document.querySelectorAll(".form-group").forEach(range => {
    const slider = range.querySelector('input[type=range]');
    const output = range.querySelector('.number-input input');
    output.innerHTML = slider.value; // Display the default slider value
    slider.addEventListener('input', () => {
      output.value = slider.value;
});




  });

