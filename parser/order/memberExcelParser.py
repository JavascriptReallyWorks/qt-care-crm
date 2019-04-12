# -*- coding: utf-8 -*-

import xlrd
import re  
import sys
import datetime

reload(sys)
sys.setdefaultencoding('utf8')

from pymongo import MongoClient
client = MongoClient('mongodb://127.0.0.1:27017')
db = client.qtc

# in Linux
# for col in range(len(sheet.row(30))):
#   print "===" + str(col) + "==="
#   print sheet.row(30)[col].value


def main():
  ex = xlrd.open_workbook('../../files/member_20190411.xlsx')
  sheet = ex.sheet_by_index(0)
  for i in range(2,sheet.nrows):
    currRow = sheet.row(i)
    data = {
      'member_id':int(currRow[1].value),
      'member_type':20 if len(currRow[2].value) > 0 else 10, # 10 qtc, 20 insurance
      
      'orders':[{
        'order_id':currRow[2].value,
        'insurance_name':currRow[3].value,
        'insurance_start_date':fiveDigitsToDate(currRow[4].value) if currRow[4].value else '', 
        'insurance_end_date':fiveDigitsToDate(currRow[5].value) if currRow[5].value else '', 
        'order_status':1 if currRow[6].value == '承保' else 4,
      }] if len(currRow[2].value) > 0 else [],

      'code':int(currRow[7].value),

      'name':currRow[8].value,
      'sex':0 if currRow[9].value == '男' else 1,
      'id_type':currRow[10].value,
      'id_number':currRow[11].value,
      'birth':fiveDigitsToDate(currRow[12].value) if currRow[12].value else '',  
      'age':int(currRow[13].value),
      'phone':currRow[14].value,
      'email':currRow[15].value,
      'order_address':currRow[16].value,
      'address':{
        'province':currRow[17].value,
        'city':currRow[18].value,
        'district':currRow[19].value,
        'detail':currRow[20].value,
      },

      'name_contact_1':currRow[21].value,
      'relation_contact_1':currRow[22].value,
      'phone_contact_1':currRow[23].value,
      'email_contact_1':currRow[24].value,
      'name_contact_2':currRow[25].value,
      'relation_contact_2':currRow[26].value,
      'phone_contact_2':currRow[27].value,
      'email_contact_2':currRow[28].value,
    }
    db.members.insert_one(data)


def fiveDigitsToDate(num):
	# return date + datetime.timedelta(hours=8)	# 中国时区
  dt = datetime.datetime(1899, 12, 30) + datetime.timedelta(num)
  return dt.strftime('%Y-%m-%d')

main()
