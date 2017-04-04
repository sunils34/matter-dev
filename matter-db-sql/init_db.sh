#!/bin/bash
/usr/bin/mysqld_safe &
sleep 5
mysql -u root -e "CREATE DATABASE matter_dev"
mysql -u root matter_dev < /tmp/bootstrap.sql
