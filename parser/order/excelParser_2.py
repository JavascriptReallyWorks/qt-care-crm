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



def main():
	ex = xlrd.open_workbook('../../files/baodan_20190410.xlsx')
	sheet = ex.sheet_by_index(0)
	for i in range(2,sheet.nrows):
		data = {
			'order_id':sheet.row(i)[6].value,
      'order_status':4 if sheet.row(i)[12].value == '终止' else 1,
      'spent_total':int(sheet.row(i)[49].value),
      'remain_total':int(sheet.row(i)[50].value),

      'insurance_name':sheet.row(i)[7].value,
      'insurance_apply_date':fiveDigitsToDate(sheet.row(i)[9].value), 
      'insurance_start_date':fiveDigitsToDate(sheet.row(i)[10].value), 
      'insurance_end_date':fiveDigitsToDate(sheet.row(i)[11].value), 
      'insurance_amount':sheet.row(i)[8].value, 
      'insurance_period':sheet.row(i)[13].value, 

      'payment_period':sheet.row(i)[14].value, 
      'payment_frequency':sheet.row(i)[16].value,
      'payment_single':sheet.row(i)[15].value, 
      'payment_method':sheet.row(i)[17].value,

      
      'applicant_name':sheet.row(i)[0].value,
      'applicant_phone':sheet.row(i)[5].value,
      'applicant_email':sheet.row(i)[19].value,
      'applicant_id_type':sheet.row(i)[3].value,
      'applicant_id_number':sheet.row(i)[4].value,
      'applicant_gender':sheet.row(i)[1].value,
      'applicant_birth':fiveDigitsToDate(sheet.row(i)[2].value),
      'applicant_height': int(sheet.row(i)[24].value) if sheet.row(i)[24].value else None,
      'applicant_weight':int(sheet.row(i)[25].value) if sheet.row(i)[25].value else None,
      'applicant_address':sheet.row(i)[26].value,
      'applicant_zip_code':sheet.row(i)[27].value,

      'applicant_marital_status':sheet.row(i)[20].value,
      'applicant_employer':sheet.row(i)[21].value,
      'applicant_job_content':sheet.row(i)[22].value,
      'applicant_job_code':sheet.row(i)[23].value,

      'insured_name':sheet.row(i)[28].value,
      'insured_phone':sheet.row(i)[34].value,
      'insured_email':sheet.row(i)[35].value,
      'insured_id_type':sheet.row(i)[32].value,
      'insured_id_number':sheet.row(i)[33].value,
      'insured_gender':sheet.row(i)[29].value, 
      'insured_birth':fiveDigitsToDate(sheet.row(i)[31].value),
      'insured_height':int(sheet.row(i)[40].value) if sheet.row(i)[40].value else None,
      'insured_weight':int(sheet.row(i)[41].value) if sheet.row(i)[41].value else None,
      'insured_address':sheet.row(i)[42].value,
      'insured_zip_code':sheet.row(i)[43].value,
      
      'insured_marital_status':sheet.row(i)[36].value,
      'insured_employer':sheet.row(i)[37].value,
      'insured_job_content':sheet.row(i)[38].value,
      'insured_job_code':sheet.row(i)[39].value,
      
      'insured_relation':sheet.row(i)[30].value,
      'insured_health_info':sheet.row(i)[18].value,
		}
		db.orders.insert_one(data)


def fiveDigitsToDate(num):
	# return date + datetime.timedelta(hours=8)	# 中国时区
  dt = datetime.datetime(1899, 12, 30) + datetime.timedelta(num)
  return dt.strftime('%Y-%m-%d')

main()
