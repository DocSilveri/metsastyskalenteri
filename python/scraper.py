import requests
import json
from datetime import date
from bs4 import BeautifulSoup

url = "https://riista.fi/metsastys/metsastysajat/"



def fetch_soup(url): 
    response = requests.get(url)

# Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'lxml')
        # Now you can use the soup object to parse the HTML content
        return soup
    else:
        print("Failed to retrieve the webpage")
        
def getGameTable(soup):
    """
    Find the table element in the given soup that has the id 'game-times__table'.

    Parameters:
    soup (BeautifulSoup): The parsed HTML content of the webpage

    Returns:
    table (bs4.element.Tag): The HTML element representing the table
    """
    table = soup.find(id='game-times__table')
    return table

def getTableRows(table):
    rows = table.find_all('tr')
    return rows

def processRowsToGroups(rows):
    """
    Process a list of table rows into groups of single-row and multi-row entries

    Parameters:
    rows (list of bs4.element.Tag): The list of table rows to process

    Returns:
    list of list of bs4.element.Tag: A list of groups of table rows, where each group
    is either a list of a single row or a list of multiple rows belonging to the same
    entry
    """
    collector = list()
    tempCollector = list()
    
    for row in rows:
        cells = row.find_all('td')
        
        idCell = cells[0]
        if idCell.has_attr('rowspan') and int(idCell['rowspan']) == 1:
            # Easier to first identify single-row entries
            # Dump possible previous multi-row entry
            if tempCollector:
                collector.append(tempCollector)
                tempCollector = list()
                
            collector.append([row])
            continue
        
        if idCell.has_attr('rowspan'):
             # Entry is multi-row
             
            # Dump possible previous multi-row entry
            if tempCollector:
                collector.append(tempCollector)
                tempCollector = list()
           
            tempCollector.append(row)
            continue
        
        # There should be multi-row entries left only
        #print(idCell)
        tempCollector.append(row)
        
    # Dump final collector
    if tempCollector:
        collector.append(tempCollector)
    
    # Finallly return the collector
    return collector
        
def processGroups(groups):
    """
    Process groups of table rows as either single-row entries or multi-row entries
    
    Parameters:
    groups (list): A list of lists of bs4.element.Tag objects. Each sub-list is a group of table rows
                   that together represent a single hunting time entry.
                   
    Returns:
    list: A list of dictionaries, each containing the data from a single hunting time entry
    """
    collector = list()
    for entry in groups:
        if len(entry) == 1:
           data = processSingleEntry(entry[0])
           collector.append(data)
           #print(data)
           #break
        else:
            data = processMultiRowEntry(entry)
            collector.append(data)
            #break
            
    return collector

def cleanTextEntry(entryText):
    # Remove multiple tabs and all newlines
    """
    Clean a text entry by removing all newlines and multiple tabs.
    
    Parameters:
    entryText (str): The text entry to clean
    
    Returns:
    str: The cleaned text entry
    """
    noBreak = entryText.strip().replace('\n', '')
    collector = list()
    
    for item in noBreak.split('\t'):
        if item:
            collector.append(item)
            
    return "\t".join(collector) 
    

def processDateData(rawdata):
    
    """
    Process the date data from a hunting time entry.

    Parameters:
    rawdata (bs4.element.Tag): The HTML table cell containing the date data.

    Returns:
    dict: A dictionary with the following keys:
        - "start" (str): The start date of the hunting time period.
        - "end" (str): The end date of the hunting time period.
        - "info" (str): Additional information about the hunting time period.

    If the cell does not contain any date data, all values will be None.
    """
    data = cleanTextEntry(rawdata.text).split("\t")
    if len(data) == 1:
        # Ei tietoa metsästysajoista
        start = None
        end = None
        info = data[0]
    else:
        # Tiedot on
        start = data[0]
        end = data[2]
        if len(data) > 3:
            info = data[3]
        else:
            info = None
    
    result = {"start": start, "end": end, "info": info}
    return result
           
    

def processSingleEntry(entry):
    # Yhden rivin tiedot
    """
    Processes a single-row entry of hunting time data to extract relevant information.

    Parameters:
    entry (bs4.element.Tag): The HTML table row containing the entry data.

    Returns:
    dict: A dictionary containing the following keys:
        - "vieraslaji" (bool): Whether the entry is for a non-native species.
        - "lajinimi" (str): The name of the species.
        - "metsastysalueet" (list): A list containing a dictionary with:
            - "metsastysalue" (str): The hunting area.
            - "metsastysajat" (dict): A dictionary with start, end, and info about the hunting times.
    """

    cells = entry.find_all('td')
    idCell = cells[0]
    vieraslaji = False
    
    if "vieraslaji" in idCell.text:
        vieraslaji = True
        lajinimi = idCell.text.split("(")[0].strip()
    else:
        lajinimi = idCell.text.strip()
            
    metsastysalue = cells[1].text
    
    #print(lajinimi)
    dateData = processDateData(cells[2])
    
    result = {
        "vieraslaji": vieraslaji,
        "lajinimi": lajinimi,
        "metsastysalueet": [{
            "metsastysalue": metsastysalue,
            "metsastysajat": dateData,
            }],
       
    }
    return result
    

def processAdditionalHuntingTimes(entry):
    """
    Processes an additional row of hunting time data to extract relevant information.

    Parameters:
    entry (bs4.element.Tag): The HTML table row containing the additional entry data.

    Returns:
    tuple: A tuple containing:
        - metsastysalue (str): The hunting area.
        - dateData (dict): A dictionary with start, end, and info about the hunting times.
    """

    cells = entry.find_all('td')
    metsastysalue = cells[0].text
    dateData = processDateData(cells[1])
    return metsastysalue, dateData
    
def processMultiRowEntry(entry):
    """
    Processes a multi-row entry of hunting time data to extract relevant information.

    Parameters:
    entry (list): A list of bs4.element.Tag objects. The first item is the main row, and the rest are additional rows.

    Returns:
    dict: A dictionary containing the following keys:
        - "vieraslaji" (bool): Whether the entry is for a non-native species.
        - "lajinimi" (str): The name of the species.
        - "metsastysalueet" (list): A list containing dictionaries with:
            - "metsastysalue" (str): The hunting area.
            - "metsastysajat" (dict): A dictionary with start, end, and info about the hunting times.
    """
    mainRow = entry[0]
    rest = entry[1:]
    resultData = processSingleEntry(mainRow)
    for item in rest:
        metsastysalue, dateData = processAdditionalHuntingTimes(item)
        resultData["metsastysalueet"].append({
            "metsastysalue": metsastysalue,
            "metsastysajat": dateData
        })
        
    return resultData
    

def dataToJSON(data,filename):
    result = dict()
    for item in data:
        key = item["lajinimi"]
        result[key] = item
        
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)

def infoJSON(data,filename):
    
        
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def main():
    soup = fetch_soup(url)
    table = getGameTable(soup)
    rows = getTableRows(table)
    groups = processRowsToGroups(rows)
    data = processGroups(groups)
    today = date.today()
    finnish_date_format = today.strftime("%d.%m.%Y")
    infoJSON({
        "last_update": f'<small>Lähde: <a href="{url}"> Riistakeskus</a>. Päivämäärä: {finnish_date_format}</small>'},"scrapeinfo.json")
    dataToJSON(data,"metsastysajat.json")
    print("Done!")

if __name__ == '__main__':
    main()