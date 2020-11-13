(function() {
    'use strict';

    var hoverBox = d3.select('#hoverbox');
    var hazardMapBaseGroup = null;

    var puneMap = {
        defaultURL: 'data/pune-electoral-wards_current.geojson',
        load: function(url) {
            url = url || puneMap.defaultURL;
            d3.json(url, function(data) {
                puneMap.data = data;
                puneMap.isLoaded = true;
                loadWardMap();
            });
        },
        isLoaded: false,
        fullData: null,
        data: null,
        render (el, size) {
            hazardMapBaseGroup = el.append('g').attr('class', 'baseGroup');
            var group = hazardMapBaseGroup.selectAll("g").data(puneMap.data.features).enter().append("g");
            var projection = d3.geoMercator().scale(110000).center([73.856255,18.516726]).translate([size.width / 2, size.height / 2]);
            var path = d3.geoPath().projection(projection);
            prabhags = group.append("path").attr("d", path).attr("class", 'ward').attr("data-ward", function(d, i) { return puneMap.fullData[i].Zone; }).attr("fill", handleMapColors).attr('stroke', handleMapColors);
        }
    };
    function setSVGSize(wrapper, svg, h) {
        h = h || .7;
        var width = parseInt(wrapper.node().getBoundingClientRect().width);
        var height = parseInt(width * h);
        svg.attr('width', width).attr('height', height);
        return {width: width, height: height};
    }
    function loadWardMap () {
        if(!puneMap.wardData) {
            d3.csv("data/C-1-ward_map.csv", function(data) {
                if(data && data.length > 0) {
                    data.sort(function(a, b) {
                        if(+a.ward === 1) {
                            hazardWardData[0].totalCases += (+a.Cases);
                            hazardWardData[0].activeCases += (+a.Active);
                            hazardWardData[0].recovered += (+a.Percentage_Recovered);
                        }
                        else if(+a.ward === 2) {
                            hazardWardData[1].totalCases += (+a.Cases);
                            hazardWardData[1].activeCases += (+a.Active);
                            hazardWardData[1].recovered += (+a.Percentage_Recovered);
                        }
                        else if(+a.ward === 3) {
                            hazardWardData[2].totalCases += (+a.Cases);
                            hazardWardData[2].activeCases += (+a.Active);
                            hazardWardData[2].recovered += (+a.Percentage_Recovered);
                        }
                        else if(+a.ward === 4) {
                            hazardWardData[3].totalCases += (+a.Cases);
                            hazardWardData[3].activeCases += (+a.Active);
                            hazardWardData[3].recovered += (+a.Percentage_Recovered);
                        }
                        else if(+a.ward === 5) {
                            hazardWardData[4].totalCases += (+a.Cases);
                            hazardWardData[4].activeCases += (+a.Active);
                            hazardWardData[4].recovered += (+a.Percentage_Recovered);
                        }
                        return (+a.ward) - (+b.ward);
                    });
                    hazardWardData[0].deaths += hazardWardData[0].totalCases - (hazardWardData[0].activeCases + hazardWardData[0].recovered);
                    hazardWardData[1].deaths += hazardWardData[1].totalCases - (hazardWardData[1].activeCases + hazardWardData[1].recovered);
                    hazardWardData[2].deaths += hazardWardData[2].totalCases - (hazardWardData[2].activeCases + hazardWardData[2].recovered);
                    hazardWardData[3].deaths += hazardWardData[3].totalCases - (hazardWardData[3].activeCases + hazardWardData[3].recovered);
                    hazardWardData[4].deaths += hazardWardData[4].totalCases - (hazardWardData[4].activeCases + hazardWardData[4].recovered);
        
                    puneMap.fullData = data;
                    
                    sortWardData(hazardActiveControl);
                    puneMap.render(hazardMap, setSVGSize(hazardMapWrapper, hazardMap));
                    wardDataControls.on('click', handleDataChange);
                    prabhags.on('mouseenter', handlePrabhagMouseEnter);
                    prabhags.on('mousemove', handlePrabhagMouseEnter);
                    hazardMapBaseGroup.on('mouseleave', handlePrabhagMouseleave);
                }
            });
        } else { 
            sortWardData(hazardActiveControl);
            puneMap.render(hazardMap, setSVGSize(hazardMapWrapper, hazardMap, 3));
        }
    }

    var hazardWardData = [
        {
            ward: 1,
            nameMarathi: "",
            nameEnglish: "",
            totalCases: 0,
            activeCases: 0,
            recovered: 0,
            deaths: 0,
            percentageRecovered: 0,
            growthRate: 0
        },
        {
            ward: 2,
            nameMarathi: "",
            nameEnglish: "",
            totalCases: 0,
            activeCases: 0,
            recovered: 0,
            deaths: 0,
            percentageRecovered: 0,
            growthRate: 0
        },
        {
            ward: 3,
            nameMarathi: "",
            nameEnglish: "",
            totalCases: 0,
            activeCases: 0,
            recovered: 0,
            deaths: 0,
            percentageRecovered: 0,
            growthRate: 0
        },
        {
            ward: 4,
            nameMarathi: "",
            nameEnglish: "",
            totalCases: 0,
            activeCases: 0,
            recovered: 0,
            deaths: 0,
            percentageRecovered: 0,
            growthRate: 0
        }, {
            ward: 5,
            nameMarathi: "",
            nameEnglish: "",
            totalCases: 0,
            activeCases: 0,
            recovered: 0,
            deaths: 0,
            percentageRecovered: 0,
            growthRate: 0
        }
    ];
    var prabhags = null;
    var hazardMapWrapper = d3.select('#covid-hazard-map');
    var hazardMap = d3.select('#hazard-map-svg');
    var hazardActiveControl = 'totalCases';
    
    var hazardMapColors = ['#C36A00', '#D98405', '#F69400', '#FFAB00', '#FFC700'];
    var wardDataControls = d3.selectAll('#covid-hazard-controls .control-wrapper');

    puneMap.load();

    function sortWardData (sortBy) {
        if(sortBy === 'totalCases') {
            hazardWardData.sort(function(a, b) { return (+b.totalCases) - (+a.totalCases); });
        } else if(sortBy === 'activeCases') {
            hazardWardData.sort(function(a, b) { return (+b.activeCases) - (+a.activeCases); });
        } else if(sortBy === 'recovered') {
            hazardWardData.sort(function(a, b) { return (+b.recovered) - (+a.recovered); });
        } else if(sortBy === 'deaths') {
            hazardWardData.sort(function(a, b) { return (+b.deaths) - (+a.deaths); });
        }
    }
    function handleMapColors(d, i) {
        var wardNo = +d3.select(this).attr('data-ward');
        // return hazardMapColors[wardNo - 1];
        if(hazardWardData[0].ward === wardNo) {
            return hazardMapColors[0];
        }
        else if(hazardWardData[1].ward === wardNo) {
            return hazardMapColors[1];
        }
        else if(hazardWardData[2].ward === wardNo) {
            return hazardMapColors[2];
        }
        else if(hazardWardData[3].ward === wardNo) {
            return hazardMapColors[3];
        }
        else if(hazardWardData[4].ward === wardNo) {
            return hazardMapColors[4];
        }
    }

    function handleDataChange(evt) {
        var d3this = d3.select(this);
        var sortBy = d3this.attr('data-type');
        
        if(!d3this.classed('active')) {
            wardDataControls.classed('active', false);
            d3this.classed('active', true);
        }
        hazardActiveControl = sortBy;
        sortWardData(sortBy);
        prabhags.attr('fill', handleMapColors).attr('stroke', handleMapColors);
    }
    function handlePrabhagMouseEnter(evt) {
        var d3this = d3.select(this);
        var wardNo = +d3this.attr('data-ward');
        var dataNo = 0;
        for(var i = 0, len = hazardWardData.length; i < len; i++){
            if(hazardWardData[i].ward == wardNo) {
                dataNo = i;
            }
        }
        var dataToShow = hazardWardData[dataNo][hazardActiveControl];
        hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").text(dataToShow);
    }
    function handlePrabhagMouseleave(evt) {
        hoverBox.classed('active', false);
    }


    // ====================================================================================================
    // ==================================================================================================== => HAZARD CITY TRAJECTORY
    // ====================================================================================================
    var hazardTrajectoryControlsWrapper = d3.select('#covid-hazard-trajectory-controls');
    var hazardTrajectoryControls = hazardTrajectoryControlsWrapper.selectAll('.control-wrapper');
    var hazardTrajectorySVGWrapper = d3.select('#hazard-growth-of-cases-wrapper');
    var hazardTrajectorySVG = d3.select('#hazard-growth-of-cases');
    var margin = {top: 30, right: 80, bottom: 80, left: 80};
    var hazardTWidth = parseInt(hazardTrajectorySVGWrapper.node().getBoundingClientRect().width - margin.left - margin.right);
    var hazardTHeight = parseInt(hazardTWidth * .9 - margin.top - margin.bottom);
    var hazardCityTData = null;
    var hazardWardTData = null;
    var hazardWards = [];
    var hazardWrdNames = [];
    var wardMaxCases = 0;
    var hazardWardColors = ['#B44630','#BE5030','#D24F30','#E14F30','#F54F30','#F56330','#F56D30','#F57730','#F58130','#F58B30','#F59530','#F59F30','#F5A930','#F5B330','#F5BD30','#F5C730','#F5D130','#F5DB30','#F5E530','#E1E530','#CDE530','#C3DB30','#C3D130','#C3C730','#C3BF30'];
    var hazardWardBaseGroup = null;
    hazardTrajectorySVG.attr('width', hazardTWidth + margin.left + margin.right).attr('height', hazardTHeight + margin.top + margin.bottom);

    function renderHazardCityTrajectory() {
        var formatTime = d3.timeFormat("%b-%d");
        var x = d3.scaleTime().range([0, hazardTWidth]);
        var y = d3.scaleLinear().range([hazardTHeight, 0]);
        var baseGroup = hazardTrajectorySVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var totalCasesValueline = d3.line().x(function(d) { return x(d['Date']); }).y(function(d) { return y(d['Total_cases']); });
        var activeCasesValueline = d3.line().x(function(d) { return x(d['Date']); }).y(function(d) { return y(d['Active']); });
        var recoveredCasesValueline = d3.line().x(function(d) { return x(d['Date']); }).y(function(d) { return y(d['Recovered']); });

        var yGrowth = d3.scaleLinear().range([hazardTHeight, 0]);
        var growthRateCasesValueline = d3.line().x(function(d) { return x(d['Date']); }).y(function(d) { return yGrowth(d['Growth_Rate_Cases']); });
        var growthRateDeathValuline = d3.line().x(function(d) { return x(d['Date']); }).y(function(d) { return yGrowth(d['Growth_Rate_Deaths']); });

        // Scale the range of the data
        x.domain(d3.extent(hazardCityTData, function(d) { return d['Date']; }));
        y.domain([0, d3.max(hazardCityTData, function(d) { return d['Total_cases']; })]);
        var y2 = d3.scaleLinear().range([hazardTHeight, 0]).domain([0, d3.max(hazardCityTData, function(d) { return d['Growth_Rate_Cases']; })]);

        yGrowth.domain([0, d3.max(hazardCityTData, function(d) { return d['Growth_Rate_Deaths']; })]);
        // Add the totalCasesValueline path.
        baseGroup.append("path").data([hazardCityTData]).attr("class", "line grey").attr("d", totalCasesValueline);
        baseGroup.append("path").data([hazardCityTData]).attr("class", "line yellow").attr("d", activeCasesValueline);
        baseGroup.append("path").data([hazardCityTData]).attr("class", "line green").attr("d", recoveredCasesValueline);

        baseGroup.append("path").data([hazardCityTData]).attr("class", "line dark-yellow").attr("d", growthRateCasesValueline);
        baseGroup.append("path").data([hazardCityTData]).attr("class", "line red").attr("d", growthRateDeathValuline);

        // Append texts at the end of the line
        baseGroup.append('text').text('Total cases').attr('x', hazardTWidth - 80).attr('class', 'grey').attr('y', function() { return y(hazardCityTData[hazardCityTData.length - 1]['Total_cases']); });
        baseGroup.append('text').text('Active cases').attr('x', hazardTWidth - 80).attr('class', 'yellow').attr('y', function() { return y(hazardCityTData[hazardCityTData.length - 1]['Active']); });
        baseGroup.append('text').text('Recovered').attr('x', hazardTWidth - 80).attr('class', 'green').attr('y', function() { return y(hazardCityTData[hazardCityTData.length - 1]['Recovered']); });
        
        baseGroup.append('text').text('Case fatality ratio').attr('x', hazardTWidth - 120).attr('class', 'dark-yellow').attr('y', function() { return yGrowth(hazardCityTData[hazardCityTData.length - 1]['Growth_Rate_Cases'] + 2); });
        baseGroup.append('text').text('Critical rate').attr('x', hazardTWidth - 80).attr('class', 'red').attr('y', function() { return yGrowth(hazardCityTData[hazardCityTData.length - 1]['Growth_Rate_Deaths'] - 2); });
    
        // Add the X Axis
        baseGroup.append("g").attr("transform", "translate(0," + hazardTHeight + ")").call(d3.axisBottom(x)).selectAll("text").text(function(d) { return formatTime(d); }).style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
    
        // Add the Y Axis
        baseGroup.append("g").call(d3.axisLeft(y));
        baseGroup.append("g").call(d3.axisRight(y2)).attr('transform', 'translate(' + hazardTWidth + ',0)');

        baseGroup.append('text').text('Absolute Number (for cases, active cases, recoveries)').attr('transform', 'rotate(-90)').attr('x', -(hazardTHeight)).attr('y', -(margin.top + 30)).style('fill', '#8F8C92');
        baseGroup.append('text').text('Percentage for CFR and CR').attr('transform', 'rotate(90)').attr('y', -(hazardTWidth + margin.top + 7)).attr('x', (hazardTHeight / 4)).style('fill', '#8F8C92');

        baseGroup.append("line").attr('x1', 40).attr('y1', 100).attr('x2', 40).attr('y2', 200).attr('stroke', '#000');
    }
    function hazardCityTrajectory() {
        if (!hazardCityTData) {
            d3.csv("data/C.2.2.city_trajectory.csv", function(error, data) {
                if (error) throw error;

                var parseTime = d3.timeParse("%d-%b");
                // format the data
                data.forEach(function(d) {
                    d['Date'] = parseTime(d['Date']);
                    d['Total_cases'] = +d['Total_cases'];
                    d['Active'] = +d['Active'];
                    d['Recovered'] = +d['Recovered'];
                    d['Growth_Rate_Cases'] = +d['Growth_Rate_Cases'];
                    d['Growth_Rate_Deaths'] = +d['Growth_Rate_Deaths'];
                });
                hazardCityTData = data;
                renderHazardCityTrajectory();
            });
        } else {
            renderHazardCityTrajectory();
        }
        
    }
    hazardCityTrajectory();

    function renderHazardCGR() {
        var group = hazardTrajectorySVG.selectAll("g").data(puneMap.data.features).enter().append("g");
        var projection = d3.geoMercator().scale(85000).center([73.856255,18.516726]).translate([hazardTWidth / 2, hazardTHeight / 1.5]);
        var path = d3.geoPath().projection(projection);
        prabhags = group.append("path").attr("d", path).attr("class", 'ward').attr("data-ward", function(d, i) { return hazardFullData[i].Zone; }).attr("fill", handleMapColors).attr('stroke', handleMapColors);
    }

    function renderHazardWardTrajectory() {
        var xScale = d3.scaleLinear().domain([0, hazardWards[0]['details'].length]).range([0, hazardTWidth]);
        var yScale = d3.scaleLinear().domain([0, wardMaxCases]).range([hazardTHeight, 0]); // output 
        var line = d3.line().x(function(d, i) { return xScale(i); }).y(function(d) { return yScale(d['cases']); });
        for (var i = 0, len = hazardWards.length; i < len; i++) {
            hazardWardBaseGroup.append("path").data([hazardWards[i]['details']]).attr("class", "line").attr('stroke', function() { return hazardWardColors[i]; }).attr("d", line);
        }
    }
    function hazardWardTrajectory() {
        hazardWardBaseGroup = hazardTrajectorySVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var k = -1;

        if(!hazardWardTData) {
            d3.csv("data/C.2.3.ward_trajectory.csv", function(error, data) {
                if (error) throw error;
                // format the data
                for(var i = 0, len = data.length; i < len; i += 1) {
                    var index = hazardWrdNames.indexOf(data[i]['Ward']);
                    data[i]['No_confirmed_cases'] = +data[i]['No_confirmed_cases'];
                    if(wardMaxCases < data[i]['No_confirmed_cases']) {
                        wardMaxCases = data[i]['No_confirmed_cases']
                    }
                    if(index < 0) {
                        hazardWrdNames.push(data[i]['Ward']);
                        hazardWards.push({'ward': data[i]['Ward'], details: [{'day': data[i]['Date'], 'cases': data[i]['No_confirmed_cases']}] });
                    } else {
                        hazardWards[index]['details'].push({'day': data[i]['Date'], 'cases': +data[i]['No_confirmed_cases']});
                    }
                };
                hazardWardTData = data;
                renderHazardWardTrajectory();
            });
        } else {
            renderHazardWardTrajectory();
        }
    }

    hazardTrajectoryControls.on('click', handleTrajectoryDataChange);
    function handleTrajectoryDataChange(evt) {
        var d3this = d3.select(this);
        var sortBy = d3this.attr('data-type');
        
        if(!d3this.classed('active')) {
            hazardTrajectoryControls.classed('active', false);
            d3this.classed('active', true);
            hazardTrajectorySVG.html('');
            if(sortBy === 'city-trajectory') {
                renderHazardCityTrajectory();
            } else if(sortBy === 'CGR') {
                renderHazardCGR();
            } else if(sortBy === 'ward-trajectory') {
                hazardWardTrajectory();
            }
        }
    }
} ());