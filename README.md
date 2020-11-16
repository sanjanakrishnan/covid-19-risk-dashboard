![Bower](https://img.shields.io/bower/l/html)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues-raw/sanjanakrishnan/covid-19-dashboard)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/sanjanakrishnan/covid-19-dashboard)


# covid-19-dashboard
The COVID-risk dashboard looks at data to understand hyper-local risk due to COVID-19 on Pune city and supplements it with micronarratives from doctors. It combines COVID hazard, healthcare infrastructure capacity, population vulnerabilities and expert narratives to arrive at a multidimensional risk assessment for Pune city.
This repository provides

*Goal*: Capture, quantify and visualize "COVID Risk" at a sub-city level to enable localized decision making


## Getting started
- check out the [demo dashboard](http://46.101.238.172/covid19-dashboard/#about) for Pune city
- read the report: [Stories and Statistics: A multidimensional risk dashboard for COVID-19](https://i-dair.org/wp-content/uploads/2020/09/2.-Pune-report_CPC-and-IDAIR-merged.pdf)


## Software Architecture
The dashboard uses HTML, CSS and JavaScript to form the front-end design, data visualizations, style and interactivity. 

To visualize the data, the graphic library D3.js is used. D3.js is an industry leader when it comes to data visualization. D3’s emphasis on web standards resulting in usage of the full capabilities of modern browsers without tying oneself to a proprietary framework, combining powerful visualization components and a data-driven approach to Document Object Model (DOM) manipulation. It has minimal overhead, is extremely fast, and supports large datasets and dynamic behavior for interaction and animation. The source code of D3 is freely available and can be reused provided the copyright is acknowledged.


## Folder Structure 

- index.html :- main file 
- data :- csv files 
- js :- java scripts; main.js is function library 
- css: - stylesheet and it’s images in respective folders 
- img :- photos. 


## Note on data
- Information on choice of indicators and data sources- [Pune Supplementary data](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/Pune_supplementary%20data.pdf)
- [Folder](https://github.com/sanjanakrishnan/covid-19-dashboard/tree/main/data) containing csv files
- How to [update dashboard data](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/data-update.md)
- Data and method for [slum mapping](https://github.com/sanjanakrishnan/IDAIR-Risk-dashboard-data/blob/main/slum_mapping.md)


### Want to contribute?

If you want to contribute through code or documentation, the [contributing guide](https://github.com/sanjanakrishnan/covid-19-dashboard/blob/main/CONTRIBUTING.md) is the best place to start. If you have questions, feel free to ask.
