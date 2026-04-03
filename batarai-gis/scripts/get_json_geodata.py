import pandas as pd
import sys
import requests
from io import StringIO

input = sys.argv[1]

# station_code = 24263 #this wmo code is for a station in Irbid, Jordan
# startDate <- dmy("29-11-1999") 
# endDate <- dmy("20-01-2001") #you could use 'today()'
# params = {
#     "lang" : "en",
#     "ord" : "REV",
#     "ndays" : input[3],
#     "ano" : input[0],
#     "mes" : input[1],
#     "day" : input[2],
#     "hora" : input[4],
#     "ind" : "24263"
# }

params = {
    "begin" : input[0],
    "end" : input[1],    
    "block" : "24263"
}

url = "http://www.ogimet.com/cgi-bin/getsynop" 
# //?lang=en&ord=REV&ndays={ndays}&ano={ano}&mes={mes}&day={day}&hora{hora}&ind={ind}'
response = requests.get(url, params=params)
data = StringIO(response.text)

df = pd.read_csv(data,sep=';',decimal=',',encoding="utf-8",on_bad_lines='skip')
result = df.to_json()

print(result)
sys.stdout.flush()