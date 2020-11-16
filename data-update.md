## About
A disaster risk framework was adopted to understand the ward level risk in Pune city. In disaster risk studies, the risk is represented as the
_(Hazard* Vulnerability)/ Capacity_
We used 15 indicators to capture the Hazard, Vulnerability and Capacity.

For details and sources of the data and choice of indicators, please refer to the document on [Supplementary data](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/Pune_supplementary%20data.pdf)

This document provides details on how to update data for the dashboard. Please refer to the structure of the individual .csv before uploading. The data and charts used in this demo can be easily modified with a few changes to the code.

The dashboard can be updated with 9 files
### updating the map geojson or shapefile
We use the geojson for [Pune city](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/data/pune-electoral-wards_current.geojson) produced by [DataMeet Pune](https://github.com/datameet/Municipal_Spatial_Data/tree/master/Pune) for this dashboard. For a different city, please use the required geojson and ensure that the data is mapped to the correct ward boundaries. In main-2.js, the authors combine several wards to form the revised ward boundaries for the city.

### updating cases data
The data related to cases/hazards can be found in 4 csvs with the prefix "C."
![Screenshot](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/img/Screenshot%202020-11-16%20at%205.54.17%20PM.png)

- C-1-ward_map.csv: update daa related to the ward level cases, recoveries, growth rate _chart 1 with map_
- C.2.2.city_trajectory.csv: update data on the city level trajectory over time _chart2.1- line graph_
- C.2.3.ward_trajectory.csv: update data on ward trajectories over time _chart2.2- on clicking the switch_
- C.3.Tests.csv: update data on daily testing and test positivity rate _chart 3 on testing_

### updating healthcare infrastructure data
The data related to healthcare infrastructure/capacity can be found in 3 csvs with the prefix "H."
- H.3.projections.csv: contains data on the bed availability and occupancy for ICU, ventilator and oxygen beds in the city, over time. It also considers projections for 3 scenatios _chart 1_
- H.2.CFR_CR.csv: data on the case fatality rate (CFR) and criticality rate (CR) over time _chart 2_
- H.1.age.csv: Data on the age wise CFR, infection rate and death rate over time _chart 1_
![Screenshot](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/img/Screenshot%202020-11-16%20at%206.00.57%20PM.png)

### updating vulnerabilities data
The data related to vulnerabilities can be found in the csv Vulnerability.csv _all maps_
For information on how this data is produced, please refer to this [link](https://github.com/sanjanakrishnan/IDAIR-Risk-dashboard-data)
![Screenshot](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/img/Screenshot%202020-11-16%20at%206.01.06%20PM.png)
