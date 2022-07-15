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

        let entries_calc = entries;

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


        if (entries.length > max_length) {

            // Get 10 most recent entries
            entries = entries.reverse()
            entries = entries.slice(0, max_length)
            entries = entries.reverse()

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

                // changes the colour of the border
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

            let button = document.createElement('button');
            button.innerHTML = "View all entries";
            
            document.querySelector('.entries').append(button);
            button.onclick = all_entries;

        }

        else {

            //put each entry in both entry table
            entries.forEach((entry, id) => {

                


                var table = document.querySelector(".dashboard-table");

                var rows = table.rows.length

                //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
                //Or if the length passes the max_length set
                if (rows >= entries.length + 2 || rows > max_length + 1) {
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

            let entries_calc = entries.reverse;
        }
        console.log(entries_calc)
            //put each entry in both entry table
            entries_calc.forEach((entry, id) => {


                // if last element (if dont assign 0, it will not work)
                if (id == 0) {
                    total_change_calc = 0;
                }
                // if not last entry
                else {

                
                    //adds a + symbol infront of positive integers
                    if ((entries_calc[id].total_networth - entries_calc[id-1].total_networth) > 0) {
                    total_change_calc = (entries_calc[id-1].total_networth - entries_calc[id].total_networth)
                    }

                    else {
                        total_change_calc = (entries_calc[id-1].total_networth - entries_calc[id].total_networth)
                    }
                }


                // calculation for dashboard Average Period Increase in infographic
                total_change_sum += (total_change_calc);


            });



            // Infographic print out
            // Average Period Increase

            average_period_increase = (total_change_sum / entries_calc.length).toFixed(2)
            average_period_increase = numberWithCommas(average_period_increase)
            document.querySelector("#average_period_dashboard").innerHTML = `$ ${average_period_increase}`;

            // Amount Change Dashboard
            var yes = (entries_calc[0].total_networth - entries_calc[entries_calc.length - 1].total_networth).toFixed(2);
            document.querySelector("#amount_change_dashboard").innerHTML = `$ ${yes}`;


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

        let entries_calc = entries;

        //get most recent entry
        var newest_entry = (entries[entries.length-1]);
        console.log(entries);

        //sum each category for charts
        var total_investable = +newest_entry.taxable + +newest_entry.tfsa + +newest_entry.rrsp + +newest_entry.other_investable;
        var total_crypto = +newest_entry.bitcoin + +newest_entry.ethereum + +newest_entry.other_crypto;
        var total_cash = +newest_entry.hard_cash + +newest_entry.checkings + +newest_entry.savings + +newest_entry.other_cash;  
        var total_personal_assets = +newest_entry.principal_residence + +newest_entry.auto + +newest_entry.other_properties + +newest_entry.goods;  
        var total_liabilities = +newest_entry.mortgages + +newest_entry.consumer_debt + +newest_entry.loans + +newest_entry.other_debt;

        console.log(entries, total_investable);
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

        var total_change_sum = 0;

        const max_length = 10;




        if (entries.length > max_length) {

            // Get 10 most recent entries
            entries = entries.reverse()
            entries = entries.slice(0, max_length)
            entries = entries.reverse()

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

                // changes the colour of the border
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

            let button = document.createElement('button');
            button.innerHTML = "View all entries";
            
            document.querySelector('.entries').append(button);
            button.onclick = all_entries;

        }

        else {

            //put each entry in both entry table
            entries.forEach((entry, id) => {

                


                var table = document.querySelector(".dashboard-table");

                var rows = table.rows.length

                //Stops from adding more rows if the user presses on 'dashboard' button again, while in dashboard
                //Or if the length passes the max_length set
                if (rows >= entries.length + 2 || rows > max_length + 1) {
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
                    total_change.innerHTML += `+ ${total_change_calc.toFixed(2)}`;
                    }

                    else {
                        var total_change_calc = (entries[id].total_networth - entries[id-1].total_networth)
                        total_change.innerHTML = total_change_calc.toFixed(2);
                    }
                }

                // changes the colour of the border
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

            let entries_calc = entries.reverse;
        }
        console.log(entries_calc)
            //put each entry in both entry table
            entries_calc.forEach((entry, id) => {


                // if last element (if dont assign 0, it will not work)
                if (id == 0) {
                    total_change_calc = 0;
                }
                // if not last entry
                else {

                
                    //adds a + symbol infront of positive integers
                    if ((entries_calc[id].total_networth - entries_calc[id-1].total_networth) > 0) {
                    total_change_calc = (entries_calc[id-1].total_networth - entries_calc[id].total_networth)
                    }

                    else {
                        total_change_calc = (entries_calc[id-1].total_networth - entries_calc[id].total_networth)
                    }
                }


                // calculation for dashboard Average Period Increase in infographic
                total_change_sum += (total_change_calc);


            });



        // Infographic print out
        // Average Period Increase

        average_period_increase = (total_change_sum / entries_calc.length).toFixed(2)
        average_period_increase = numberWithCommas(average_period_increase)
        document.querySelector("#average_period_dashboard").innerHTML = `$ ${average_period_increase}`;

        // Amount Change Dashboard
        var yes = (entries_calc[0].total_networth - entries_calc[entries_calc.length - 1].total_networth).toFixed(2);
        document.querySelector("#amount_change_dashboard").innerHTML = `$ ${yes}`;


    })  

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

