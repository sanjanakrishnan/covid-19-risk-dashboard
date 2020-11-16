This document provides details on how to update data for the dashboard. PLease refer to the structure of the individual .csv before uploading. The data and charts used in this demo can be easily modified with a few changes to the code. 
For choice of indicators and primary data, please refer to the document on Supplementary data

The dashboard can be updated with 9 files
1. The shapefile/geojson: We use the geojson for [Pune city](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/data/pune-electoral-wards_current.geojson) produced by [DataMeet Pune](https://github.com/datameet/Municipal_Spatial_Data/tree/master/Pune) for this dashboard. For a different city, please use the required geojson and ensure that the data is mapped to the correct ward boundaries. In main-2.js, the authors combine several wards to form the revised ward boundaries for the city.


2. The data related to cases/hazards can be found in 4 csvs with the prefix "C."
![Screenshot](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/img/Screenshot%202020-11-16%20at%205.54.17%20PM.png)

- C-1-ward_map.csv: update daa related to the ward level cases, recoveries, growth rate
- C.2.2.city_trajectory.csv: update data on the city level trajectory over time
- C.2.3.ward_trajectory.csv: update data on ward trajectories over time
- C.3.Tests.csv: update data on daily testing and test positivity rate


3. The data related to healthcare infrastructure/capacity can be found in 3 csvs with the prefix "H."
- H.3.projections.csv: contains data on the bed availability and occupancy for ICU, ventilator and oxygen beds in the city, over time. It also considers projections for 3 scenatios
- H.2.CFR_CR.csv: data on the case fatality rate (CFR) and criticality rate (CR) over time
- H.1.age.csv: Data on the age wise CFR, infection rate and death rate over time
![Screenshot](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/img/Screenshot%202020-11-16%20at%206.00.57%20PM.png)


4. The data related to vulnerabilities can be found in the csv Vulnerability.csv
For information on how this data is produced, please refer to this [link](https://github.com/sanjanakrishnan/IDAIR-Risk-dashboard-data)
![Screenshot](/Users/sanjana/Dropbox/Screenshots/Screenshot 2020-11-16 at 6.01.06 PM)
