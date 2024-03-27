async function createTableHeader(table){
    const tr=document.createElement('tr');
    const sno=document.createElement('th');sno.appendChild(document.createTextNode('S.No'));
    const conuntry=document.createElement('th');conuntry.appendChild(document.createTextNode('Countries'));
    const continent=document.createElement('th');continent.appendChild(document.createTextNode('Continent'));
    const capital=document.createElement('th');capital.appendChild(document.createTextNode('Capital'));
    const abbr=document.createElement('th');abbr.appendChild(document.createTextNode('Abbreviation'));
    tr.append(sno);tr.append(conuntry);tr.append(capital);tr.append(continent);tr.append(abbr);
    table.append(tr);
}
async function createTableRow(table,row,i){
    const tr=document.createElement('tr');
    const sno=document.createElement('td');sno.appendChild(document.createTextNode(i));
    const conuntry=document.createElement('td');conuntry.appendChild(document.createTextNode(row.Country));
    const continent=document.createElement('td');continent.appendChild(document.createTextNode(row.Capital));
    const capital=document.createElement('td');capital.appendChild(document.createTextNode(row.Continent));
    const abbr=document.createElement('td');abbr.appendChild(document.createTextNode(row.Abbreviation));
    tr.append(sno);tr.append(conuntry);tr.append(continent);tr.append(capital);tr.append(abbr);
    table.append(tr);
}

async function createSelectMap(jsonURL){
    const optionsMap=new Map();
    const { pathname } = new URL(jsonURL);

    const resp = await fetch(pathname);
    optionsMap.set('all','All Countries');optionsMap.set('asia','Asia');optionsMap.set('europe','Europe');optionsMap.set('africa','Africa');optionsMap.set('america','America');optionsMap.set('australia','Australia');
    const select=document.createElement('select');
    select.id = 'region';
    select.name='region';
    optionsMap.forEach((val,key) => {
        const option = document.createElement('option');
        option.textContent = val;
        option.value = key;
        select.append(option);
      });
     
     const div=document.createElement('div'); 
     div.classList.add('region-select');
     div.append(select);
    return div; 
}
async function createTable(jsonURL,val) {

    const  pathname = null;
    if(val){
        pathname=jsonURL;
    }else{
        pathname= new URL(jsonURL);
    }
    
    const resp = await fetch(pathname);
    const json = await resp.json();
    console.log('=====JSON=====> {} ',json);
    
    const table = document.createElement('table');
    createTableHeader(table);
    json.data.forEach((row,i) => {

        createTableRow(table,row,(i+1));

      
    });
    
    return table;
}    

export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');
    const parientDiv=document.createElement('div');
    parientDiv.classList.add('contries-block');

    if (countries) {
        parientDiv.append(await createSelectMap(countries.href));
        parientDiv.append(await createTable(countries.href,null));
        countries.replaceWith(parientDiv);
        
    }
    const dropdown=document.getElementById('region');
      dropdown.addEventListener('change', () => {
        const url=countries.href;
        if(dropdown.value!='all'){
            url=countries.href+'?sheet='+dropdown.value;
        }
        const tableE=parientDiv.querySelector(':scope > table');
        const promise = Promise.resolve(createTable(url,dropdown.value));
        promise.then(function (val) {
            tableE.replaceWith(val);
        });
      });
  }