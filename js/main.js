jQuery(document).ready(function ($) {
    'use strict';

    /////////////////////////////////////////////////////////////////////////// AOS INIT
    AOS.init();

    $(window).on('resize', function(evt) {
        location.reload();
    });

    /////////////////////////////////////////////////////////////////////////// UPDATE ALL THE TITLES
    var updatedTitle = function(id, obj) {
        $('#' + id).find('header h1').text(obj.heading);
        $('#' + id).find('header h3').text(obj.sub);
    }
    
    updatedTitle('cases', tlsNsubTls.covid19Hazard.cases.total);
    updatedTitle('growth', tlsNsubTls.covid19Hazard.growth['city-trajectory']);
    updatedTitle('projections', tlsNsubTls.healthcareCapacity.projections.O2_beds);
    updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age0to10);
    updatedTitle('cr', tlsNsubTls.healthcareCapacity.cr.cr);
    updatedTitle('density', tlsNsubTls.vulnerabilities.density.density);
    updatedTitle('comorbid', tlsNsubTls.vulnerabilities.comorbid.comorbid);
    updatedTitle('wash', tlsNsubTls.vulnerabilities.wash.wash);


    /////////////////////////////////////////////////////////////////////////// ODOMETER INIT
    var el = document.querySelector('#total-num');
    var od = new Odometer({ el: el, value: 0, theme: 'minimal' });
    od.update(154581);

    var el2 = document.querySelector('#active-num');
    var od2 = new Odometer({ el: el2, value: 0, theme: 'minimal' });
    od2.update(12285);

    var el3 = document.querySelector('#recoveries-num');
    var od3 = new Odometer({ el: el3, value: 0, theme: 'minimal' });
    od3.update(142296);

    var el4 = document.querySelector('#deaths-num');
    var od4 = new Odometer({ el: el4, value: 0, theme: 'minimal' });
    od4.update(3844);

    /////////////////////////////////////////////////////////////////////////// DATA HANDLER FUNCTION
    var cases       = null;
    var density     = null;
    var comorbid    = null;
    var wash        = null;

    var growth      = null;
    var tpr         = null;

    function handleErrors(id, error) {
        console.log(id + ' : Some unknown error occured.');
    }
    var dataHandler = {
        baseUrl: 'data/',
        puneMap: {
            url: 'pune-electoral-wards_current.geojson',
            data: null,
            dataTransform: function (data) {
                if (data && data.features) {
                    dataHandler.puneMap.data = data.features;
                    dataHandler.load('cases');
                    // dataHandler.load('growthCases');
                    // dataHandler.load('tpr');
                    // dataHandler.load('projections');
                    // dataHandler.load('tests');
                    // dataHandler.load('age');
                    // dataHandler.load('cfr');
                    dataHandler.load('vulnerability');
                }
            }
        },
        cases: {
            url: 'C-1-ward_map.csv',
            data: null,
            dataTransform: function (error, data) {
                if (error) handleErrors('cases', error);
                if (data) {
                    dataHandler.cases.data = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        dataHandler.cases.data.push(
                            {
                                zone        : +(data[i]['Zone']),
                                wardNo      : +(data[i]['ward']),
                                name        : data[i]['Ward Office Name'],
                                total       : +data[i]['Cases'],
                                active      : +data[i]['Active'],
                                recovered   : +data[i]['Percentage_Recovered'],
                                growthRate  : +data[i]['Growth_Rate'],
                                deaths      : (+data[i]['Cases']) - (+data[i]['Active']) - (+data[i]['Percentage_Recovered'])
                            }
                        );
                    }
                    dataHandler.cases.data.sort(function(a, b) { return a.wardNo > b.wardNo ? 1 : -1; });
                    cases = CityMap().init('cases', 'total', true, '#F0AD00', tlsNsubTls.covid19Hazard.cases).createMap(dataHandler.puneMap.data, dataHandler.cases.data, ['zone', 'name', 'total', 'active', 'recovered', 'deaths']);
                }
            }
        },
        growthCases: {
            url: 'C.2.2.city_trajectory.csv',
            data: null,
            dataTransform: function (data) {
                console.log('you are loading data for growthCases');
                if (data) {
                    //
                }
            }
        },
        tpr: {
            url: 'C.2.3.ward_trajectory.csv',
            data: null,
            dataTransform: function (data) {
                console.log('you are loading data for tpr');
                if (data) {
                    //
                }
            }
        },
        tests: {
            url: 'C.3.Tests.csv',
            data: null,
            dataTransform: function (data) {
                if (data && data.length > 0)
                {
                    for(var i = 0, len = data.length; i < len; i++)
                    {
                        var dateSplit = data[i]['Date'].split('/');
                        var thisDate = new Date(dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2]);

                        data[i]['date']     = thisDate;
                        data[i]['value']    = +data[i]['Value'];
                    }
                    dataHandler.tests.data = data;
                    tpr     = LineChart('tpr').init(dataHandler.tests.data).createLine('value', 2, '#D29B18').addXAxis("%d %b").addYAxis();
                }
            }
        },
        projections: {
            url: 'H.3.projections.csv',
            data: null,
            dataTransform: function (data) {
                console.log('you are loading data for projections');
                if (data) {
                    //
                }
            }
        },
        age: {
            url: 'H.1.age.csv',
            data: null,
            dataTransform: function (data) {
                console.log('you are loading data for age');
                if (data) {
                    //
                }
            }
        },
        cfr: {
            url: 'H.2.CFR_CR.csv',
            data: null,
            dataTransform: function (data) {
                console.log('you are loading data for cfr');
                if (data) {
                    //
                }
            }
        },
        vulnerability: {
            url: 'Vulnerability.csv',
            data: null,
            dataTransform: function (error, data) {
               if (error) handleErrors('cases', error);
                if (data && data.length > 0) {
                    dataHandler.vulnerability.data = [];
                    for(var i = 0, len = data.length; i < len; i++)
                    {
                        dataHandler.vulnerability.data.push({
                            wardNo      : +(data[i]['ward']),
                            name        : data[i]['Ward Office Name'],
                            density     : +(data[i]['Population_density']),
                            slumDensity : +(data[i]['Perc_slum_population']),
                            toilets     : +(data[i]['toilets_percapslum']),
                            publicTaps  : +(data[i]['publictaps_percapslum']),
                            wash        : +(data[i]['WASH_vunerability']),
                            comorbid    : +(data[i]['comorbid']),
                            pregnant    : +(data[i]['pregnant'])
                        });
                    }
                    dataHandler.vulnerability.data.sort(function(a, b) { return a.wardNo > b.wardNo });
                    density     = CityMap().init('density', 'density', true, '#D03B38', tlsNsubTls.vulnerabilities.density).createMap(dataHandler.puneMap.data, dataHandler.vulnerability.data, ['name', 'density', 'slumDensity']);
                    comorbid    = CityMap(1).init('comorbid', 'comorbid', true, '#D03B38', tlsNsubTls.vulnerabilities.comorbid).createMap(dataHandler.puneMap.data, dataHandler.vulnerability.data, ['name', 'comorbid', 'pregnant']);
                    wash        = CityMap(1).init('wash', 'wash', true, '#D03B38', tlsNsubTls.vulnerabilities.wash).createMap(dataHandler.puneMap.data, dataHandler.vulnerability.data, ['name', 'wash', 'toilets', 'publicTaps']);
                }
            }
        },
        init: function () {
            this.getUrl.bind(this);
            this.load.bind(this);
            this.load('puneMap');
        },
        getUrl: function (id) {
            return this.baseUrl + this[id].url;
        },
        load: function (id) {
            id = id || 'default';
            switch (id) {
                case 'puneMap':
                    d3.json(this.getUrl('puneMap'), this['puneMap'].dataTransform)
                    break;
                default:
                    d3.csv(this.getUrl(id), this[id].dataTransform);
                    break;
            }
        }
    };


    /////////////////////////////////////////////////////////////////////////// INIT EVERYTHING
    dataHandler.init();



    /////////////////////////////////////////////////////////////////////////// All the line graphs
    var lockdownDates = [new Date('25 March 2020'), new Date('15 April 2020'), new Date('4 May 2020'), new Date('27 May 2020'), new Date('14 July 2020'), new Date('23 July 2020')];
    var hoverBox = d3.select('#hoverbox');
    function handlePrabhagMouseleave(evt) {
        hoverBox.classed('active', false);
    }
    // ====================================================================================================
    // ==================================================================================================== => HAZARD CITY TRAJECTORY
    // ====================================================================================================
    var growthWrapper = d3.select('#growth');
    var hazardTrajectoryControls = growthWrapper.select('.controls-type').selectAll('button');
    var hazardTrajectorySVGWrapper = growthWrapper.select('.chart-wrapper');
    var hazardTrajectorySVG = hazardTrajectorySVGWrapper.append('svg');
    if (hazardTWidth < 992) {
        var margin = {top: 20, right: 40, bottom: 60, left: 60};
    } else {
        var margin = {top: 30, right: 80, bottom: 80, left: 80};
    }
    var hazardTWidth = parseInt($('#growth').find('.chart-wrapper').width()) - margin.left - margin.right;
    if (hazardTWidth < 500) {
        var size = 1;
    } else {
        var size = .7;
    }
    var hazardTHeight = parseInt(hazardTWidth * size - margin.top - margin.bottom);
    var hazardCityTData = null;
    var hazardWardTData = null;
    var hazardWards = [];
    var hazardWrdNames = [];
    var wardMaxCases = 0;
    var ctLastMonth = null;
    var ctLastWeek = null;
    var activeData = 'allData';
    var hazardMapColors = ['#6C1211', '#8A2D0E', '#9C3C0D', '#D22D23', '#DE4F2F', '#F05D3D', '#F86D20', '#EB8527', '#F58B30', '#F59530', '#F59F30', '#F5A930', '#F5B330', '#F5BD30', '#F5C730', '#F5D130', '#F5DB30'];
    var hazardWardColors = ['#B44630','#BE5030','#D24F30','#E14F30','#F54F30','#F56330','#F56D30','#F57730','#F58130','#F58B30','#F59530','#F59F30','#F5A930','#F5B330','#F5BD30','#F5C730','#F5D130','#F5DB30','#F5E530','#E1E530','#CDE530','#C3DB30','#C3D130','#C3C730','#C3BF30'];
    var hazardWardBaseGroup = null;
    var citySubControls = d3.selectAll('#ct-sub-controls .toggle-holder');
    var hazardCGRData = [];
    var CGRColors = d3.scaleOrdinal().range(hazardWardColors);
    var wtLastMonth = null;
    var wtLastWeek = null;
    var activeTrajectory = 'city-trajectory';

    hazardTrajectorySVG.attr('width', hazardTWidth + margin.left + margin.right).attr('height', hazardTHeight + margin.top + margin.bottom);

    function cityTrajectoryMouseenter(d, val) {
        var formatTime = d3.timeFormat("%d-%b-%y");
        var dataToShow = formatTime(d['Date']);
        hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html('<span class="small">' + dataToShow + '</span><br><span class="b">' + d[val] + '</span>');
    }
    function renderCityTrajectory() {
        hazardTrajectorySVG.html('');
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

        var updatedData = null;
        if(activeData == 'allData') {
            updatedData = hazardCityTData;
        }
        else if(activeData == 'lastMonth') {
            updatedData = hazardCityTData.slice((ctLastMonth - 1));
        }
        else if(activeData == 'lastWeek') {
            updatedData = hazardCityTData.slice((ctLastWeek - 1));
        }

        // Scale the range of the data
        x.domain(d3.extent(updatedData, function(d) { return d['Date']; })); 
        y.domain([0, d3.max(updatedData, function(d) { return d['Total_cases']; })]);
        var y2 = d3.scaleLinear().range([hazardTHeight, 0]).domain([0, d3.max(updatedData, function(d) { return d['Growth_Rate_Cases']; })]);

        yGrowth.domain([0, d3.max(updatedData, function(d) { if(activeData === 'allData') { return d['Growth_Rate_Deaths']; } else { return d['Growth_Rate_Cases']; } })]);

        baseGroup.append("line").attr('x1', x(lockdownDates[0])).attr('y1', 0).attr('x2', x(lockdownDates[0])).attr('y2', hazardTHeight).attr('stroke', '#D2D0D4');
        baseGroup.append("line").attr('x1', x(lockdownDates[1])).attr('y1', 0).attr('x2', x(lockdownDates[1])).attr('y2', hazardTHeight).attr('stroke', '#D2D0D4');
        baseGroup.append("line").attr('x1', x(lockdownDates[2])).attr('y1', 0).attr('x2', x(lockdownDates[2])).attr('y2', hazardTHeight).attr('stroke', '#D2D0D4');
        baseGroup.append("line").attr('x1', x(lockdownDates[3])).attr('y1', 0).attr('x2', x(lockdownDates[3])).attr('y2', hazardTHeight).attr('stroke', '#D2D0D4');
        baseGroup.append("line").attr('x1', x(lockdownDates[4])).attr('y1', 0).attr('x2', x(lockdownDates[4])).attr('y2', hazardTHeight).attr('stroke', '#D2D0D4');

        // Add the totalCasesValueline path.
        baseGroup.append("path").data([updatedData]).attr("class", "line grey").attr("d", totalCasesValueline);
        baseGroup.append("path").data([updatedData]).attr("class", "line yellow").attr("d", activeCasesValueline);
        baseGroup.append("path").data([updatedData]).attr("class", "line green").attr("d", recoveredCasesValueline);

        baseGroup.append("path").data([updatedData]).attr("class", "line dark-yellow").attr("d", growthRateCasesValueline);
        baseGroup.append("path").data([updatedData]).attr("class", "line red").attr("d", growthRateDeathValuline);

        // circles for hover
        baseGroup.selectAll("circle.total").data(updatedData).enter().append('circle').attr('class', 'total grey').attr('r', '2').attr('cx', function(d) { return x(d['Date']); }).attr('cy', function(d) { return y(d['Total_cases']) }).on('mouseenter', function(d) { cityTrajectoryMouseenter(d, 'Total_cases'); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        baseGroup.selectAll("circle.active").data(updatedData).enter().append('circle').attr('class', 'active yellow').attr('r', '2').attr('cx', function(d) { return x(d['Date']); }).attr('cy', function(d) { return y(d['Active']) }).on('mouseenter', function(d) { cityTrajectoryMouseenter(d, 'Active'); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        baseGroup.selectAll("circle.recovered").data(updatedData).enter().append('circle').attr('class', 'recovered green').attr('r', '2').attr('cx', function(d) { return x(d['Date']); }).attr('cy', function(d) { return y(d['Recovered']) }).on('mouseenter', function(d) { cityTrajectoryMouseenter(d, 'Recovered'); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        baseGroup.selectAll("circle.growth-cases").data(updatedData).enter().append('circle').attr('class', 'growth-cases dark-yellow').attr('r', '2').attr('cx', function(d) { return x(d['Date']); }).attr('cy', function(d) { return yGrowth(d['Growth_Rate_Cases']) }).on('mouseenter', function(d) { cityTrajectoryMouseenter(d, 'Growth_Rate_Cases'); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        baseGroup.selectAll("circle.growth-deaths").data(updatedData).enter().append('circle').attr('class', 'growth-deaths red').attr('r', '2').attr('cx', function(d) { return x(d['Date']); }).attr('cy', function(d) { return yGrowth(d['Growth_Rate_Deaths']) }).on('mouseenter', function(d) { cityTrajectoryMouseenter(d, 'Growth_Rate_Deaths'); }).on('mouseleave', function() { hoverBox.classed('active', false); });


        // Append texts at the end of the line
        baseGroup.append('text').text('Total cases').attr('x', hazardTWidth - 80).attr('class', 'grey').attr('y', function() { return y(updatedData[updatedData.length - 1]['Total_cases']); });
        baseGroup.append('text').text('Active cases').attr('x', hazardTWidth - 80).attr('class', 'yellow').attr('y', function() { return y(updatedData[updatedData.length - 1]['Active']); });
        baseGroup.append('text').text('Recovered').attr('x', hazardTWidth - 80).attr('class', 'green').attr('y', function() { return y(updatedData[updatedData.length - 1]['Recovered']); });
        
        baseGroup.append('text').text('Growth of cases').attr('x', hazardTWidth - 120).attr('class', 'dark-yellow').attr('y', function() { if(activeData === 'allData') { return yGrowth(updatedData[updatedData.length - 1]['Growth_Rate_Cases'] + 2); } else { return yGrowth(updatedData[updatedData.length - 1]['Growth_Rate_Cases']) } });
        baseGroup.append('text').text('Growth of deaths').attr('x', hazardTWidth - 80).attr('class', 'red').attr('y', function() { if(activeData === 'allData') { return yGrowth(updatedData[updatedData.length - 1]['Growth_Rate_Deaths'] - 2); } else { return yGrowth(updatedData[updatedData.length - 1]['Growth_Rate_Deaths']) } });
    
        // Add the X Axis
        baseGroup.append("g").attr("transform", "translate(0," + hazardTHeight + ")").call(d3.axisBottom(x)).selectAll("text").text(function(d) { return formatTime(d); }).style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
    
        // Add the Y Axis
        baseGroup.append("g").call(d3.axisLeft(y));
        baseGroup.append("g").call(d3.axisRight(y2)).attr('transform', 'translate(' + hazardTWidth + ',0)');

        baseGroup.append('text').text('Absolute Number (for cases, active cases, recoveries)').attr('transform', 'rotate(-90)').attr('x', -(hazardTHeight + 30)).attr('y', -(margin.top + 30)).style('fill', '#8F8C92').style('font-size', '11px');
        baseGroup.append('text').text('Percentage for CFR and CR').attr('transform', 'rotate(90)').attr('y', -(hazardTWidth + margin.top + 7)).attr('x', (hazardTHeight / 4)).style('fill', '#8F8C92').style('font-size', '11px');
    }
    function cityTrajectoryInit() {
        if (!hazardCityTData) {
            d3.csv("data/C.2.2.city_trajectory.csv", function(error, data) {
                if (error) throw error;

                var lastDate = new Date(data[data.length - 1]['Date'] + '-2020').getTime();
                var oneMonthAgo = lastDate - 2592000000;
                var oneWeekAgo = lastDate - 604800000;
                
                data.forEach(function(d, i) {
                    // determine last month
                    var thisDate = new Date(d['Date'] + '-2020');
                    var thisDateTStamp = thisDate.getTime();

                    if (!ctLastMonth && thisDateTStamp > oneMonthAgo) {
                        ctLastMonth = i;
                    }
                    if(!ctLastWeek && thisDateTStamp > oneWeekAgo) {
                        ctLastWeek = i;
                    }
                    // determine last week

                    d['Date'] = thisDate;
                    d['Total_cases'] = +d['Total_cases'];
                    d['Active'] = +d['Active'];
                    d['Recovered'] = +d['Recovered'];
                    d['Growth_Rate_Cases'] = +d['Growth_Rate_Cases'];
                    d['Growth_Rate_Deaths'] = +d['Growth_Rate_Deaths'];
                });
                hazardCityTData = data;
                renderCityTrajectory();
            });
        } else {
            renderCityTrajectory();
        }
    }
    cityTrajectoryInit();
    wardTrajectoryInit();
    
    function handleCGRColors(d) {
        var wardNo = +d3.select(this).attr('data-ward');
        var dataNo = null;
        for(var i = 0, len = dataHandler.cases.data.length; i < len; i++) {
            if (dataHandler.cases.data[i].zone == wardNo) {
                return hazardMapColors[i];
            }
        }
    }
    function handleCGRMouseEnter(evt) {
        var d3this = d3.select(this);
        var name = d3this.attr('data-name');
        var dataToShow = d3this.attr('data-growthRate');
        var dataToShow = name + '<br>' + dataToShow;
        hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow);
    }
    function renderHazardCGR() {
        var min = d3.min(dataHandler.cases.data, function (d) { return +d['growthRate']; });
        var max = d3.max(dataHandler.cases.data, function (d) { return +d['growthRate']; });
        var opacityRange = d3.scaleLinear().domain([min, max]).range([20, 100]);


        hazardTrajectorySVG.html('');

        var group = hazardTrajectorySVG.selectAll("g").data(dataHandler.puneMap.data).enter().append("g");
        var projection = d3.geoMercator().scale(78000).center([73.856255,18.516726]).translate([hazardTWidth / 2 + (hazardTWidth * .2), hazardTHeight / 1.5]);
        var path = d3.geoPath().projection(projection);
        var groups = group.append("path").attr("d", path).attr("class", 'ward')
            .attr("data-ward", function(d, i) { return dataHandler.cases.data[i].zone; })
            .attr("data-name", function(d, i) { return dataHandler.cases.data[i]['name']; })
            .attr("data-growthRate", function(d, i) { return dataHandler.cases.data[i]['growthRate']; })
            .attr("fill", '#F0AD00').style('opacity', function (d, i) { return opacityRange(dataHandler.cases.data[i]['growthRate']) / 100; });

        groups.on('mouseenter', handleCGRMouseEnter);
        groups.on('mousemove', handleCGRMouseEnter);
        groups.on('mouseleave', handlePrabhagMouseleave);
    }
    function wardTrajectoryMouseenter(d, wardD) {
        var formatTime = d3.timeFormat("%d-%b-%y");
        var dataToShow = formatTime(d['Date']);
        var ward = d3.select(this).attr('data-ward');
        hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html('<span class="small">' + ward + '</span><br><span class="b">' + d['cases'] + '</span>');
    }
    function renderWardTrajectory() {
        hazardTrajectorySVG.html('');
        var formatTime = d3.timeFormat("%b-%d");
        var baseGroup = hazardTrajectorySVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var updatedData = [];
        if(activeData == 'allData') {
            updatedData = hazardWards;
        }
        else if(activeData == 'lastMonth') {
            for(var i = 0, len = hazardWards.length; i < len; i++) {
                updatedData.push({'ward': hazardWards[i]['ward'], 'details': hazardWards[i]['details'].slice(wtLastMonth -  1) });
            }
            // updatedData = hazardWards.slice((wtLastMonth - 1));
        }
        else if(activeData == 'lastWeek') {
            for(var i = 0, len = hazardWards.length; i < len; i++) {
                updatedData.push({'ward': hazardWards[i]['ward'], 'details': hazardWards[i]['details'].slice(wtLastWeek -  1) });
            }
            // updatedData = hazardWards.slice((wtLastWeek - 1));
        }
        var xScale = d3.scaleTime().range([0, hazardTWidth]).domain([new Date(updatedData[0]['details'][0]['day']), new Date(updatedData[0]['details'][updatedData[0]['details'].length - 1]['day'])]);
        var yScale = d3.scaleLinear().domain([0, wardMaxCases]).range([hazardTHeight, 0]); // output 
        var line = d3.line().x(function(d, i) { return xScale(new Date(d['day'])); }).y(function(d) { return yScale(d['cases']); });

        // Add the X Axis
        baseGroup.append("g").attr("transform", "translate(0," + hazardTHeight + ")").call(d3.axisBottom(xScale)).selectAll("text").text(function(d) { return formatTime(d); }).style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
    
        // Add the Y Axis
        baseGroup.append("g").call(d3.axisLeft(yScale));
        for (var i = 0, len = updatedData.length; i < len; i++) {
            baseGroup.append("path").attr('data-ward', updatedData[i]['ward']).data([updatedData[i]['details']]).attr("class", "line").attr('stroke', function() { return hazardWardColors[i]; }).attr("d", line).on('mouseenter', wardTrajectoryHover).on('mousemove', wardTrajectoryHover).on('mouseleave', handlePrabhagMouseleave);
            baseGroup.append("circle").attr('data-ward', updatedData[i]['ward']).data([updatedData[i]['details']]).attr('class', 'line').attr('fill', function() { return hazardWardColors[i]; }).attr('r', 3).attr('cx', hazardTWidth - 2).attr('cy', yScale(updatedData[i]['details'][updatedData[i]['details'].length - 1]['cases'])).on('mouseenter', wardTrajectoryHover).on('mousemove', wardTrajectoryHover).on('mouseleave', handlePrabhagMouseleave);
            baseGroup.selectAll('circle.circle-' + i).data(updatedData[i]['details']).enter().append('circle').attr('class', 'circle-' + i).attr('data-ward', updatedData[i]['ward']).attr('r', '2').attr('cx', function(d) { return xScale(new Date(d['day'])); }).attr('cy', function(d) { return yScale(d['cases']); }).attr('fill', function() { return hazardWardColors[i]; }).on('mouseenter', wardTrajectoryMouseenter).on('mouseleave', function(d) { hoverBox.classed('active', false) });
        }
        baseGroup.append('text').text('Pune total').attr('x', 40).attr('y', 20).style('font-size', 16);
        baseGroup.append('text').text(wardMaxCases).attr('x', 40).attr('y', 48).style('font-size', 28).style('font-weight', 'bold');
        baseGroup.append('text').text(updatedData[0]['details'][updatedData[0]['details'].length -  1]['day']).attr('x', 40).attr('y', 66).style('font-size', 16);
    }
    function wardTrajectoryHover(d) {
        var name = d3.select(this).attr('data-ward');
        hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(name);
    }
    function wardTrajectoryInit() {
        hazardWardBaseGroup = hazardTrajectorySVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var k = -1;

        if(!hazardWardTData) {
            d3.csv("data/C.2.3.ward_trajectory.csv", function(error, data) {
                if (error) throw error;

                var lastDate = new Date(data[data.length - 1]['Date']).getTime();
                var oneMonthAgo = lastDate - 2592000000;
                var oneWeekAgo = lastDate - 604800000;

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
                for(var i = 0, len = hazardWards[0]['details'].length; i < len; i++) {
                    var thisDate = new Date(hazardWards[0]['details'][i]['day']);
                    var thisDateTStamp = thisDate.getTime();

                    if (!wtLastMonth && thisDateTStamp > oneMonthAgo) {
                        wtLastMonth = i;
                    }
                    if(!wtLastWeek && thisDateTStamp > oneWeekAgo) {
                        wtLastWeek = i;
                    }
                }
                hazardWardTData = data;
                // renderWardTrajectory();
            });
        } else {
            // renderWardTrajectory();
        }
    }
    hazardTrajectoryControls.on('click', handleTrajectoryDataChange);
    citySubControls.on('click', handleCTSCclick);
    function handleTrajectoryDataChange(evt) {
        var d3this = d3.select(this);
        var sortBy = d3this.attr('data-type');
        
        if(!d3this.classed('selected')) {
            hazardTrajectoryControls.classed('selected', false);
            d3this.classed('selected', true);
            hazardTrajectorySVG.html('');
            // d3.select('#growthCasesTitle').text(tlsNsubTls.covid19Hazard.growthCases[sortBy].heading);
            // d3.select('#growthCasesSub').text(tlsNsubTls.covid19Hazard.growthCases[sortBy].sub);
            if(sortBy === 'city-trajectory') {
                activeTrajectory = 'city-trajectory';
                renderCityTrajectory();
                updatedTitle('growth', tlsNsubTls.covid19Hazard.growth['city-trajectory']);
            } else if(sortBy === 'CGR') {
                renderHazardCGR();
                updatedTitle('growth', tlsNsubTls.covid19Hazard.growth['CGR']);
            } else if(sortBy === 'ward-trajectory') {
                activeTrajectory = 'ward-trajectory';
                renderWardTrajectory();
                updatedTitle('growth', tlsNsubTls.covid19Hazard.growth['ward-trajectory']);
            }
        }
    }
    function handleCTSCclick(evt) {
        var d3this = d3.select(this);
        activeData = d3this.attr('data-sort');
        if(!d3this.classed('active')) {
            citySubControls.classed('active', false);
            d3this.classed('active', true);
            d3.select('#growthCasesTitle').text(tlsNsubTls.covid19Hazard.growthCases[activeData].heading);
            d3.select('#growthCasesSub').text(tlsNsubTls.covid19Hazard.growthCases[activeData].sub);
            if(activeTrajectory === 'city-trajectory') {
                renderCityTrajectory();
            } else if(activeTrajectory === 'ward-trajectory') {
                renderWardTrajectory();
            }
        }
    }








    var testsWrapper = d3.select('#tests');
    var testsChartBox = testsWrapper.select('.chart-box');
    var test = testsChartBox.append('svg');
    var testControls = testsWrapper.selectAll('.sort-control button');
    var testWidth = parseInt($('#tests').find('.chart-box').width());
    var testHeight = testWidth * .6;
    // if(testWidth < 600) { testHeight = .6; }
    test.attr('width', testWidth).attr('height', testHeight);
    // var testSize = setSVGSize(testsWrapper, test, testHeights);
    var testsData = null;
    var maxTests = 0;
    var minTests = 1000000000;
    var testActiveData = 'allData';
    var testsLastMonth = 0;
    var testsLastWeek = 0;

    function testsInit() {
        if (!testsData) {
            d3.csv("data/C.3.Tests.csv", function(error, data) {
                if (error) throw error;

                if (data && data.length > 0) {

                    var dateSplit = data[data.length - 1]['Date'].split('/');
                    var lastDate = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
                    lastDate = new Date(lastDate).getTime();
                    var oneMonthAgo = lastDate - 2592000000;
                    var oneWeekAgo = lastDate - 604800000;
                    for(var i = 0, len = data.length; i < len; i++) {
                        var numVal = +data[i]['Value'];
                        if (numVal > maxTests) {
                            maxTests = numVal;
                        }
                        if (numVal < minTests) {
                            minTests = numVal;
                        }
                        var dateSplit = data[i]['Date'].split('/');
                        var thisDate = new Date(dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2]);
                        var thisDateTStamp = thisDate.getTime();

                        if (!testsLastMonth && thisDateTStamp > oneMonthAgo) {
                            testsLastMonth = i;
                        }
                        if(!testsLastWeek && thisDateTStamp > oneWeekAgo) {
                            testsLastWeek = i;
                        }

                        data[i]['Date'] = thisDate;
                        data[i]['Value'] = numVal;
                    }
                    testsData = data;
                }
                renderTestsGraph();
            });
        }
    }
    testsInit();
    function testHoverFunction (d) {
        var formatTime = d3.timeFormat("%d-%b-%y");
        var dataToShow = '<span class="small">' + formatTime(d['Date']) + '</span><br>' + '<span class="b">' + d['Value'] + '</span>';
        hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow);
    }
    function renderTestsGraph() {
        test.html('');
        var updatedData = null;
        if(testActiveData == 'allData') {
            updatedData = testsData;
        }
        else if(testActiveData == 'lastMonth') {
            updatedData = testsData.slice((testsLastMonth - 1));
        }
        else if(testActiveData == 'lastWeek') {
            updatedData = testsData.slice((testsLastWeek - 1));
        }
        var formatTime = d3.timeFormat("%d %b");
        var x = d3.scaleTime().range([0, testWidth - margin.left - margin.right]).domain([updatedData[0]['Date'], updatedData[updatedData.length - 1]['Date']]);
        var y = d3.scaleLinear().range([testHeight - margin.top - margin.bottom, 0]).domain([0, maxTests + 2]);
        var baseGroup = test.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var valueline = d3.line().x(function(d) { return x(d['Date']); }).y(function(d) { return y(d['Value']); });
        // Add the totalCasesValueline path.
        baseGroup.append("path").data([updatedData]).attr("class", "line dark-yellow").attr("d", valueline);
        baseGroup.selectAll('circle').data(updatedData).enter().append('circle').attr('r', '2').attr('cx', function(d) { return x(d['Date']); }).attr('cy', function(d) { return y(d['Value']); }).attr("class", "circle dark-yellow").on('mouseenter', testHoverFunction).on('mouseleave', function() { hoverBox.classed('active', false); });
        
        baseGroup.append("line").attr('x1', 0).attr('y1', y(5)).attr('x2', testWidth - margin.right - margin.left).attr('y2', y(5)).attr('stroke', '#ccc');
        baseGroup.append('text').text('Positivity Rate Threshold').attr('x', 10).attr('y', y(5) + 12).style('font-size', '12').style('fill', '#aaa');

        // var unloack1X = x(new Date('06-05-2020'));
        // baseGroup.append("line").attr('x1', unloack1X).attr('y1', 0).attr('x2', unloack1X).attr('y2', testHeight - margin.top - margin.bottom).attr('stroke', '#ddd');
        // baseGroup.append('text').text('Pune unlock 1').attr('x', unloack1X).attr('y', 0).style('font-size', '12').style('fill', '#aaa');

        // var unloack2X = x(new Date('07-14-2020'));
        // baseGroup.append("line").attr('x1', unloack2X).attr('y1', 0).attr('x2', unloack2X).attr('y2', testHeight - margin.top - margin.bottom).attr('stroke', '#ddd');
        // baseGroup.append('text').text('Pune unlock 2').attr('x', unloack2X).attr('y', 0).style('font-size', '12').style('fill', '#aaa');
        // Add the X Axis
        baseGroup.append("g").attr("transform", "translate(0," + (testHeight - margin.top - margin.bottom) + ")").call(d3.axisBottom(x)).selectAll("text").text(function(d) { return formatTime(d); }).style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
        // Add the Y Axis
        baseGroup.append("g").call(d3.axisLeft(y).ticks(8)).selectAll("text").text(function(d) { return d + '%'; });
        testControls.on('click', handleTestControlClick);
    }
    function handleTestControlClick(evt) {
        var d3this = d3.select(this);
        testActiveData = d3this.attr('data-sort');
        if(!d3this.classed('selected')) {
            testControls.classed('selected', false);
            d3this.classed('selected', true);
            renderTestsGraph();
        }
    }






    // ====================================================================================================
    // ==================================================================================================== => HEALTHCARE CAPACITY
    // ====================================================================================================
    var projWrapper = d3.select('#projections').select('.chart-wrapper');
    var proj = projWrapper.append('svg');
    var projWidth = parseInt($('#projections').find('.chart-wrapper').width());
    var projHeight = parseInt(projWidth * .4);
    proj.attr('width', projWidth).attr('height', projHeight);
    // var projSize = setSVGSize(projWrapper, proj, .6);
    var projBaseGroup = null;
    var projData = null;
    var maxWorstCase = 0;
    var projActiveControl = 'projections';
    var projControls = d3.select('#projections').select('.controls-type').selectAll('button');
    var projSubCWrapper = d3.select('#proj-sub-controls-wrapper');
    var projDataControls = d3.select('#projections').select('.controls-sort').selectAll('button');
    var months = null;
    var projDDate = 0;
    var projDToShow = 'O2_beds';
    
    function projInit() {
        if (!projData) {
            d3.csv("data/H.3.projections.csv", function(error, data) {
                if (error) throw error;
                if(data && data.length > 0) {
                    projData = {};
                    var parseDate = d3.timeParse("%d/%m/%y");

                    for(var i = 0, len = data.length; i < len; i++) {
                        var param = data[i]['parameter'];
                        if (!projData[param])
                        {
                            projData[param] = [];
                        }
                        var bedCapacity = 0;
                        var bedsOccupied = 0;
                        var bedsOccupiedBestCase = 0;
                        var bedsOccupiedWorstCase = 0;
                        if (!isNaN(+data[i]['Bed_capacity'])) {
                            bedCapacity = +data[i]['Bed_capacity'];
                        }
                        if(!isNaN(+data[i]['Beds_occupied'])) {
                            bedsOccupied = +data[i]['Beds_occupied'];
                        }
                        if (+data[i]['Beds_occupied_best_case']) {
                            bedsOccupiedBestCase = +data[i]['Beds_occupied_best_case'];
                        }
                        if (+data[i]['Beds_oocupied_worst_case']) {
                            bedsOccupiedWorstCase = +data[i]['Beds_oocupied_worst_case'];
                        }
                        projData[param].push({
                            date :                  parseDate(data[i]['Date']),
                            activeQuo:              +data[i]['Active_status_quo'],
                            bedCapacity:            bedCapacity,
                            bedsOccupied:           bedsOccupied,
                            bestCase:               +data[i]['Active_best_case'],
                            bedsOccupiedBestCase:   bedsOccupiedBestCase,
                            worstCase:              +data[i]['Active_worst_case'],
                            bedsOccupiedWorstCase:  +data[i]['Beds_oocupied_worst_case']
                        });
                    
                        if(+data[i]['Active_worst_case'] > maxWorstCase) {
                            maxWorstCase = +data[i]['Active_worst_case'];
                        }
                    }
                    renderOtherMap();
                }
            });
        } else {
            renderOtherMap();
        }
    }
    projInit();
    function handleTestMouseenter(d, val) {
        var formatTime = d3.timeFormat("%d-%b-%y");
        var dataToShow = '<span class="small">' + formatTime(d['date']) + '</span><br><span class="b">' + d[val] + '</span>';
        hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow);
    }
    function renderOtherMap()
    {
        proj.html('');
        if (projDDate === 0) {
            var startDate = 0;
        } else {
            var startDate = projDDate - 1;
        }
        var thisData    = projData[projDToShow].slice(startDate, projData[projDToShow].length);
        var formatTime  = d3.timeFormat("%d %b");
        var x           = d3.scaleTime().range([0, projWidth - margin.left - margin.right]).domain([thisData[0]['date'], thisData[thisData.length - 1]['date']]);
        var y           = d3.scaleLinear().range([projHeight - margin.top - margin.bottom, 0]).domain([0, d3.max(thisData, function(d) { if(d['bedCapacity'] > d['bedsOccupied']) { return d['bedCapacity'] + d['bedCapacity'] * .3; } else { return d['bedsOccupied'] + d['bedsOccupied'] * .15; } })]);

        var baseGroup   = proj.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var valueline   = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['bedCapacity']); });
        var valueline2  = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['bedsOccupied']); });

        proj.append('rect').attr('width', 14).attr('height', 14).attr('x', margin.left).attr('y', 5).attr('fill', '#16737D');
        proj.append('text').text('Beds Capacity').attr('x', margin.left + 20).attr('y', 16).attr('fill', '#16737D');
        proj.append('rect').attr('width', 14).attr('height', 14).attr('x', margin.left + 120).attr('y', 5).attr('fill', '#0896A5');
        proj.append('text').text('Beds Occupancy').attr('x', margin.left + 140).attr('y', 16).attr('fill', '#0896A5');

        baseGroup.append("path").data([thisData]).attr("class", "line").attr("d", valueline).style('stroke', '#16737D');
        baseGroup.append('text').text('Beds Capacity').attr('x', 5).attr('y', function() { return y(thisData[0]['bedCapacity']) - 4; }).attr('fill', '#16737D');
        baseGroup.append("path").data([thisData]).attr("class", "line").attr("d", valueline2).style('stroke', '#0896A5');
        baseGroup.append('text').text('Beds Occupancy').attr('x', 5).attr('y', function() { return y(thisData[0]['bedsOccupied']) - 4; }).attr('fill', '#0896A5');
        baseGroup.selectAll('circle.line-1').data(thisData).enter().append('circle').attr('class', 'line-1').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['bedCapacity']); }).style('fill', '#16737D').on('mouseenter', function(d) { handleTestMouseenter(d, 'bedCapacity'); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        baseGroup.selectAll('circle.line-2').data(thisData).enter().append('circle').attr('class', 'line-2').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['bedsOccupied']); }).style('fill', '#0896A5').on('mouseenter', function(d) { handleTestMouseenter(d, 'bedsOccupied'); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        
        // Add the X Axis
        baseGroup.append("g").attr("transform", "translate(0," + (projHeight - margin.top - margin.bottom) + ")").call(d3.axisBottom(x)).selectAll("text").text(function(d) { return formatTime(d); }).style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
        // Add the Y Axis
        baseGroup.append("g").call(d3.axisLeft(y)).selectAll("text").text(function(d) { return d + '%'; });
    }
    function renderProjections()
    {
        // GET MONTHS LIST FROM THE DATA
        proj.html('');
        var now = new Date();
        var nextMonth = now.getMonth() + 1;
        var timeFormat = d3.timeFormat('%b');

        months = d3.timeMonths(projData['O2_beds'][0]['date'], projData['O2_beds'][projData['O2_beds'].length - 1]['date'], 1);

        var formatTime = d3.timeFormat("%d/%m/%y");
        var x = d3.scaleTime().range([0, projWidth - margin.left - margin.right]).domain([projData['O2_beds'][0]['date'], projData['O2_beds'][projData['O2_beds'].length - 1]['date']]);
        var y = d3.scaleLinear().range([projHeight - margin.top - margin.bottom, 0]).domain([0, maxWorstCase]);
        projBaseGroup = proj.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var valueline = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['activeQuo']); });
        var bestCase = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['bestCase']); });
        var worstCase = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['worstCase']); });

        // projBaseGroup.append("line").attr('x1', x(lockdownDates[0])).attr('y1', 0).attr('x2', x(lockdownDates[0])).attr('y2', projHeight - margin.top - margin.bottom).attr('stroke', '#D2D0D4');
        // projBaseGroup.append("line").attr('x1', x(lockdownDates[1])).attr('y1', 0).attr('x2', x(lockdownDates[1])).attr('y2', projHeight - margin.top - margin.bottom).attr('stroke', '#D2D0D4');
        projBaseGroup.append("line").attr('x1', x(lockdownDates[2])).attr('y1', 0).attr('x2', x(lockdownDates[2])).attr('y2', projHeight - margin.top - margin.bottom).attr('stroke', '#D2D0D4');
        projBaseGroup.append("line").attr('x1', x(lockdownDates[3])).attr('y1', 0).attr('x2', x(lockdownDates[3])).attr('y2', projHeight - margin.top - margin.bottom).attr('stroke', '#D2D0D4');
        projBaseGroup.append("line").attr('x1', x(lockdownDates[4])).attr('y1', 0).attr('x2', x(lockdownDates[4])).attr('y2', projHeight - margin.top - margin.bottom).attr('stroke', '#D2D0D4');
        projBaseGroup.append("line").attr('x1', x(now)).attr('y1', 0).attr('x2', x(new Date())).attr('y2', projHeight - margin.top - margin.bottom).attr('stroke', '#D2D0D4');
        projBaseGroup.append("text").text('Today').attr('x', x(now)).style("text-anchor", "end");

        // Add the totalCasesValueline path.
        projBaseGroup.append("path").data([projData['O2_beds']]).attr("class", "line grey").attr("d", bestCase).attr('class', 'line green');
        projBaseGroup.append("path").data([projData['O2_beds']]).attr("class", "line grey").attr("d", worstCase).attr('class', 'line red');
        projBaseGroup.append("path").data([projData['O2_beds']]).attr("class", "line grey").attr("d", valueline);

        projBaseGroup.selectAll('circle.hover').data(projData['O2_beds']).enter().append('circle').attr('class', 'hover').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['activeQuo']); }).on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['date']) + '</span><br><span class="b">' + d['activeQuo'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        projBaseGroup.selectAll('circle.hover2').data(projData['O2_beds']).enter().append('circle').attr('class', 'hover2 green').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['bestCase']); }).on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['date']) + '</span><br><span class="b">' + d['bestCase'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        projBaseGroup.selectAll('circle.hover3').data(projData['O2_beds']).enter().append('circle').attr('class', 'hover3 red').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['worstCase']); }).on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['date']) + '</span><br><span class="b">' + d['worstCase'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });

        // Add the X Axis
        projBaseGroup.append("g").attr("transform", "translate(0," + (projHeight - margin.bottom - margin.top) + ")").call(d3.axisBottom(x).ticks(months.length)).selectAll("text").text(function(d, i) { return timeFormat(d); });
    
        // Add the Y Axis
        projBaseGroup.append("g").call(d3.axisLeft(y));
    }
    // d3.select('#healthcareInfrasctructureTitle').text(tlsNsubTls.healthcareCapacity.healthcareInfrastructure.O2_beds.heading);
    // d3.select('#healthcareInfrasctructureSub').text(tlsNsubTls.healthcareCapacity.healthcareInfrastructure.O2_beds.sub);
    projControls.on('click', handleProjControlsClick);
    function handleProjControlsClick()
    {
        var d3this = d3.select(this);
        var sortBy = d3this.attr('data-type');
        
        if(!d3this.classed('selected'))
        {
            projControls.classed('selected', false);
            d3this.classed('selected', true);

            if (sortBy === 'projections')
            {
                d3.select('#projections').select('.controls-sort').classed('hide', true);
                projDToShow = sortBy;
                renderProjections();
            } else {
                if(d3.select('#projections').select('.controls-sort').classed('hide')) { d3.select('#projections').select('.controls-sort').classed('hide', false); }
                projDToShow = sortBy;
                renderOtherMap();
            }
            updatedTitle('projections', tlsNsubTls.healthcareCapacity.projections[projDToShow]);
        }
    }
    projDataControls.on('click', handleProjDataControlsClick);
    function handleProjDataControlsClick(evt) {
        
        if (projDToShow === 'projections') {
            return false;
        }
        var d3this = d3.select(this);
        var sortBy = d3this.attr('data-sort');

        if (!d3this.classed('selected')) {
            projDataControls.classed('selected', false);
            d3this.classed('selected', true);
            if (sortBy === 'allData') {
                projDDate = 0; // SET projDDate BY SEARCHING FOR THE DATA
            } else if(sortBy === 'lastMonth') {
                var thisData = projData[projDToShow];
                var lastDate = thisData[thisData.length - 1]['date'];
                lastDate = lastDate.getTime();
                var oneMonthAgo = lastDate - 2592000000;
                var lastEntry = null;
                for(var i = 0, len = thisData.length; i < len; i++){
                    // set updated date for projDDate
                    // if last date - 30days == data[i]['date']
                    var thisDateTStamp = thisData[i]['date'].getTime();
                    if (!lastEntry && thisDateTStamp > oneMonthAgo) {
                        projDDate = i;
                        lastEntry = i;
                    }
                }

            } else if(sortBy === 'lastWeek') {
                var thisData = projData[projDToShow];
                var lastDate = thisData[thisData.length - 1]['date'];
                lastDate = lastDate.getTime();
                var oneWeekAgo = lastDate - 604800000;
                var lastEntry = null;
                for(var i = 0, len = thisData.length; i < len; i++){
                    // set updated date for projDDate
                    // if last date - 30days == data[i]['date']
                    var thisDateTStamp = thisData[i]['date'].getTime();
                    if(!lastEntry && thisDateTStamp > oneWeekAgo) {
                        projDDate = i;
                        lastEntry = i;
                    }
                }
            }
            renderOtherMap();
        }
    }





    var ageData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    var sliderVertical = d3.sliderBottom().min(10).max(100).width(260).default(0).step(10).tickFormat(function(d) { return (d - 10) + '-' + d; }).on('onchange', verticleAgeSliderChange);
    var gVertical = d3.select('div#slider-vertical').html('').append('svg').attr('width', 300).attr('height', 100).append('g').attr('transform', 'translate(20,20)');
    gVertical.call(sliderVertical).selectAll('g.tick text').style("text-anchor", "start").attr('transform', 'translate(25, 14), rotate(90)');
    gVertical.selectAll('.parameter-value text').style("text-anchor", "start").attr('transform', 'translate(35, 14), rotate(90)');

    var cfrWrapper = d3.select('#cfr').select('.chart-wrapper');
    var cfr = cfrWrapper.append('svg');
    var cfrWidth = parseInt($('#cfr').find('.chart-wrapper').width());
    var cfrHeight = parseInt(cfrWidth * .7);
    cfr.attr('width', cfrWidth).attr('height', cfrHeight);
    // var cfrSize = setSVGSize(cfrWrapper, cfr, .8);
    var cfrBaseGroup = null;
    var cfrData = {};
    var cfrX = null;
    var cfrY = null;
    var cfrDefaultAge = 'Age 0-10';
    var cfrDefaultTime = 'allData';
    var cfrLine = null;
    var cfrCasesLine = null;
    var cfrDeathsLine = null;
    var cfrDataControls = d3.select('#cfr').select('.controls-sort').selectAll('button');
    // var cfrInitialized = false;
    
    // var cfrTitle = d3.select('#cfrTitle');
    // cfrTitle.text(tlsNsubTls.healthcareCapacity.CFR.age0to10.heading);
    function verticleAgeSliderChange(val)
    {
        switch(val) {
            case 20:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age10to20);
                break;
            case 30:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age20to30);
                break;
            case 40:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age30to40);
                break;
            case 50:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age40to50);
                break;
            case 60:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age50to60);
                break;
            case 70:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age60to70);
                break;
            case 80:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age70to80);
                break;
            case 90:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age80to90);
                break;
            case 100:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age90to100);
                break;
            default:
                updatedTitle('cfr', tlsNsubTls.healthcareCapacity.cfr.age0to10);
                break;
        }
        cfrDefaultAge = 'Age ' + (val-10) + '-' + val; renderCfr();
    }
    function cfrInit() {
        if (!cfrData['Age 0-10']) {
            d3.csv("data/H.1.age.csv", function(error, data) {
                if (error) throw error;
                if(data && data.length > 0) {
                    for(var i = 0, len = data.length; i < len; i++) {
                        data[i]['Date'] = new Date(data[i]['Date']);
                        data[i]['CFR'] = parseInt(data[i]['CFR']);
                        data[i]['Perc_cases'] = parseInt(data[i]['Perc_cases']);
                        data[i]['Perc_deaths'] = parseInt(data[i]['Perc_deaths']);
                        if (!cfrData[data[i]['Age_group']]) {
                            cfrData[data[i]['Age_group']] = [];
                        }
                        cfrData[data[i]['Age_group']].push(data[i]);
                    }
                    renderCfr();
                }
            });
        } else {
            renderCfr();
        }
    }
    cfrInit();
    function renderCfr() {
        cfr.html('');
        if (cfrWidth < 400) {
            cfrX = d3.scaleTime().range([0, cfrWidth - margin.left / 2 - margin.right / 5]);
            cfrY = d3.scaleLinear().range([cfrHeight - margin.top - margin.bottom, 0]);
            cfrBaseGroup = cfr.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        } else {
            cfrX = d3.scaleTime().range([0, cfrWidth - margin.left - margin.right]);
            cfrY = d3.scaleLinear().range([cfrHeight - margin.top - margin.bottom, 0]);
            cfrBaseGroup = cfr.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        var baseDataArr = cfrData[cfrDefaultAge];
        var d3Max = 0;
        for (var i = 0, len = baseDataArr.length; i < len; i++)
        {
            if(baseDataArr[i]['CFR'] > d3Max) {
                d3Max = baseDataArr[i]['CFR'];
            } else if(baseDataArr[i]['Perc_cases'] > d3Max) {
                d3Max = baseDataArr[i]['Perc_cases'];
            } else if(baseDataArr[i]['Perc_deaths'] > d3Max) {
                d3Max = baseDataArr[i]['Perc_deaths'];
            }
        }
        cfrY.domain([0, d3Max + 3]);

        var line1 = d3.line().x(function(d) { return cfrX(d['Date']); }).y(function(d) { return cfrY(d['CFR']); });
        var line2 = d3.line().x(function(d) { return cfrX(d['Date']); }).y(function(d) { return cfrY(d['Perc_cases']); });
        var line3 = d3.line().x(function(d) { return cfrX(d['Date']); }).y(function(d) { return cfrY(d['Perc_deaths']); });

        cfr.append('rect').attr('width', 10).attr('height', 10).attr('x', margin.left).attr('y', 5).attr('class', 'green');
        cfr.append('text').text('CFR').attr('x', margin.left + 16).attr('y', 16).attr('class', 'green');
        cfr.append('rect').attr('width', 10).attr('height', 10).attr('x', margin.left + 70).attr('y', 5).attr('class', 'grey');
        cfr.append('text').text('Perc_cases').attr('x', margin.left + 86).attr('y', 16).attr('class', 'grey');
        cfr.append('rect').attr('width', 10).attr('height', 10).attr('x', margin.left + 175).attr('y', 5).attr('class', 'red');
        cfr.append('text').text('Perc_deaths').attr('x', margin.left + 190).attr('y', 16).attr('class', 'red');
        
        // Scale the range of the data
        if(cfrDefaultTime == 'allData')
        {
            cfrX.domain([baseDataArr[0]['Date'], baseDataArr[baseDataArr.length - 1]['Date']]);

            // Add the totalCasesValueline path.
            cfrLine = cfrBaseGroup.append("path").data([baseDataArr]).attr("d", line1).attr('class', 'line green');
            cfrCasesLine = cfrBaseGroup.append("path").data([baseDataArr]).attr("d", line2).attr('class', 'line grey');
            cfrDeathsLine = cfrBaseGroup.append("path").data([baseDataArr]).attr("d", line3).attr('class', 'line red');

            // Add the totalCasesValueline path.
            cfrLine = cfrBaseGroup.append("path").data([baseDataArr]).attr("d", line1).attr('class', 'line green');
            cfrCasesLine = cfrBaseGroup.append("path").data([baseDataArr]).attr("d", line2).attr('class', 'line grey');
            cfrDeathsLine = cfrBaseGroup.append("path").data([baseDataArr]).attr("d", line3).attr('class', 'line red');

            cfrBaseGroup.selectAll('circle.one').data(baseDataArr).enter().append('circle').attr('class', 'one').attr('r', '3').attr('cx', function(d) { return cfrX(d['Date']); }).attr('cy', function(d) { return cfrY(d['CFR']); }).attr('class', 'green').on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['Date']) + '</span><br><span class="b">' + d['CFR'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });
            cfrBaseGroup.selectAll('circle.two').data(baseDataArr).enter().append('circle').attr('class', 'two').attr('r', '3').attr('cx', function(d) { return cfrX(d['Date']); }).attr('cy', function(d) { return cfrY(d['Perc_cases']); }).attr('class', 'grey').on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['Date']) + '</span><br><span class="b">' + d['Perc_cases'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });
            cfrBaseGroup.selectAll('circle.three').data(baseDataArr).enter().append('circle').attr('class', 'three').attr('r', '3').attr('cx', function(d) { return cfrX(d['Date']); }).attr('cy', function(d) { return cfrY(d['Perc_deaths']); }).attr('class', 'red').on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['Date']) + '</span><br><span class="b">' + d['Perc_deaths'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });

            // Add the X Axis
            cfrBaseGroup.append("g").attr("transform", "translate(0," + (cfrHeight - margin.bottom - margin.top) + ")").call(d3.axisBottom(cfrX)).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
        }
        else if(cfrDefaultTime == 'lastMonth')
        {
            var da = baseDataArr.slice(baseDataArr.length - 4, baseDataArr.length - 1);
            cfrX.domain([da[0]['Date'], da[da.length - 1]['Date']]);

            // Add the totalCasesValueline path.
            cfrLine = cfrBaseGroup.append("path").data([da]).attr("d", line1).attr('class', 'line green');
            cfrCasesLine = cfrBaseGroup.append("path").data([da]).attr("d", line2).attr('class', 'line grey');
            cfrDeathsLine = cfrBaseGroup.append("path").data([da]).attr("d", line3).attr('class', 'line red');

            // Add the X Axis
            cfrBaseGroup.append("g").attr("transform", "translate(0," + (cfrHeight - margin.bottom - margin.top) + ")").call(d3.axisBottom(cfrX)).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
        }
        else if(cfrDefaultTime == 'lastWeek')
        {
            var da = baseDataArr.slice(baseDataArr.length - 3, baseDataArr.length - 1);
            cfrX.domain([da[0]['Date'], da[da.length - 1]['Date']]);

            // Add the totalCasesValueline path.
            cfrLine = cfrBaseGroup.append("path").data([da]).attr("d", line1).attr('class', 'line green');
            cfrCasesLine = cfrBaseGroup.append("path").data([da]).attr("d", line2).attr('class', 'line grey');
            cfrDeathsLine = cfrBaseGroup.append("path").data([da]).attr("d", line3).attr('class', 'line red');

            // Add the X Axis
            cfrBaseGroup.append("g").attr("transform", "translate(0," + (cfrHeight - margin.bottom - margin.top) + ")").call(d3.axisBottom(cfrX)).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
        }
    
        // Add the Y Axis
        cfrBaseGroup.append("g").call(d3.axisLeft(cfrY));
    }
    cfrDataControls.on('click', handleCfrDataControlsClick);
    function handleCfrDataControlsClick() {
        var d3this = d3.select(this);
        if(!d3this.classed('selected')) {
            cfrDataControls.classed('selected', false);
            d3this.classed('selected', true);
            cfrDefaultTime = d3this.attr('data-sort');
            renderCfr();
        }
    }






    var crWrapper = d3.select('#cr').select('.chart-wrapper');
    var cr = crWrapper.append('svg');
    var crWidth = parseInt($('#cr').find('.chart-wrapper').width());
    var crHeight = parseInt(crWidth * .7);
    cr.attr('width', crWidth).attr('height', crHeight);
    var crDataControls = d3.select('#cr').selectAll('.controls-type button');
    var crControls = d3.selectAll('#cr .controls-sort button');

    var crData = [];
    var crActiveType = 'cr';
    var crcfrMax = 0;
    var icuMax = 0;
    var crActiveData = 'allData';
    var crLastMonth = null;
    var crLastWeek = null;
    // var cfrInitialized = false;
    
    function crInit() {
        if (!crData['Age 0-10']) {
            d3.csv("data/H.2.CFR_CR.csv", function(error, data) {
                if (error) throw error;

                if(data && data.length > 0) {

                    var dateSplit = data[data.length - 1]['Date'].split('/');
                    var lastDate = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
                    lastDate = new Date(lastDate).getTime();
                    var oneMonthAgo = lastDate - 2592000000;
                    var oneWeekAgo = lastDate - 604800000;

                    for(var i = 0, len = data.length; i < len; i++) {
                        if(data[i]['Date']) {
                            
                            if (!crLastMonth && thisDateTStamp > oneMonthAgo) {
                                    crLastMonth = i;
                            }
                            if(!crLastWeek && thisDateTStamp > oneWeekAgo) {
                                crLastWeek = i;
                            }

                            var intCR = parseInt(data[i]['CR']);
                            var intCFR = parseInt(data[i]['CFR']);
                            var intICU = parseInt(data[i]['ICU_patients']);
                            var intVentilator = parseInt(data[i]['Ventilator_patients']);

                            var dateSplit = data[i]['Date'].split('/');
                            var thisDate = new Date(dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2]);
                            var thisDateTStamp = thisDate.getTime();

                            if (intCR > crcfrMax) {
                                crcfrMax = intCR;
                            } else if(intCFR > crcfrMax) {
                                crcfrMax = intCFR;
                            }
                            if(intICU > icuMax) {
                                icuMax = intICU;
                            } else if(intVentilator > icuMax) {
                                icuMax = intVentilator;
                            }

                            crData.push({
                                'date'      : thisDate,
                                'cr'        : intCR,
                                'cfr'       : intCFR,
                                'icu'       : intICU,
                                'ventilator': intVentilator
                            });
                        }
                    }
                    rendercr();
                }
            });
        } else {
            rendercr();
        }
    }
    crInit();
    function rendercr() {
        cr.html('');
        var updatedData = null;
        if(crActiveData == 'allData') {
            updatedData = crData;
        }
        else if(crActiveData == 'lastMonth') {
            updatedData = crData.slice((crLastMonth - 1));
        }
        else if(crActiveData == 'lastWeek') {
            updatedData = crData.slice((crLastWeek - 1));
        }

        var formatTime = d3.timeFormat("%d %b");
        if(crWidth < 500) {
            var x = d3.scaleTime().range([0, crWidth - (margin.left / 2) - (margin.right / 5)]).domain([updatedData[0]['date'], updatedData[updatedData.length - 1]['date']]);
        } else {
            var x = d3.scaleTime().range([0, crWidth - margin.left - margin.right]).domain([updatedData[0]['date'], updatedData[updatedData.length - 1]['date']]);
        }
        var y = null;
        if (crActiveType == 'cr') {
            y = d3.scaleLinear().range([crHeight - margin.top - margin.bottom, 0]).domain([0, crcfrMax + 2]);
        } else if (crActiveType == 'icu'){
            y = d3.scaleLinear().range([crHeight - margin.top - margin.bottom, 0]).domain([0, icuMax + 2]);
        }
        var baseGroup = cr.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var valueline = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['cr']); });
        var valueline2 = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['cfr']); });
        var valueline3 = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['icu']); });
        var valueline4 = d3.line().x(function(d) { return x(d['date']); }).y(function(d) { return y(d['ventilator']); });


        // // Add the totalCasesValueline path.
        if (crActiveType == 'cr') {
            cr.append('rect').attr('width', 10).attr('height', 10).attr('x', margin.left).attr('y', 5).attr('class', 'green');
            cr.append('text').text('Critically Rate').attr('x', margin.left + 16).attr('y', 16).attr('class', 'green');
            cr.append('rect').attr('width', 10).attr('height', 10).attr('x', margin.left + 130).attr('y', 5).attr('class', 'dark-green');
            cr.append('text').text('Case Fatality Rate').attr('x', margin.left + 146).attr('y', 16).attr('class', 'dark-green');
            // statement
            baseGroup.append("path").data([updatedData]).attr("class", "line green").attr("d", valueline);
            baseGroup.append("path").data([updatedData]).attr("class", "line dark-green").attr("d", valueline2);
            baseGroup.selectAll('circle.hover').data(updatedData).enter().append('circle').attr('class', 'hover').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['cr']); }).attr('class', 'green').on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['date']) + '</span><br><span class="b">' + d['cr'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });
            baseGroup.selectAll('circle.hover2').data(updatedData).enter().append('circle').attr('class', 'hover2').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['cfr']); }).attr('class', 'dark-green').on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['date']) + '</span><br><span class="b">' + d['cfr'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        } else if(crActiveType == 'icu') {
            cr.append('rect').attr('width', 10).attr('height', 10).attr('x', margin.left).attr('y', 5).attr('class', 'green');
            cr.append('text').text('ICU Admit Rate').attr('x', margin.left + 16).attr('y', 16).attr('class', 'green');
            cr.append('rect').attr('width', 10).attr('height', 10).attr('x', margin.left + 130).attr('y', 5).attr('class', 'dark-green');
            cr.append('text').text('Ventilator Admit Rate').attr('x', margin.left + 146).attr('y', 16).attr('class', 'dark-green');
            baseGroup.append("path").data([updatedData]).attr("class", "line green").attr("d", valueline3);
            baseGroup.append("path").data([updatedData]).attr("class", "line dark-green").attr("d", valueline4);
            baseGroup.selectAll('circle.hover').data(updatedData).enter().append('circle').attr('class', 'hover').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['icu']); }).attr('class', 'green').on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['date']) + '</span><br><span class="b">' + d['icu'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });
            baseGroup.selectAll('circle.hover2').data(updatedData).enter().append('circle').attr('class', 'hover2').attr('r', '3').attr('cx', function(d) { return x(d['date']); }).attr('cy', function(d) { return y(d['ventilator']); }).attr('class', 'dark-green').on('mouseenter', function(d) { var formatTime = d3.timeFormat("%d-%b-%y"); var dataToShow = '<span class="small">' + formatTime(d['date']) + '</span><br><span class="b">' + d['ventilator'] + '</span>'; hoverBox.classed('active', true).style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY - 40) + "px").html(dataToShow); }).on('mouseleave', function() { hoverBox.classed('active', false); });
        }
        
        // baseGroup.append("line").attr('x1', 0).attr('y1', y(minTests)).attr('x2', testSize.width - margin.right - margin.left).attr('y2', y(minTests)).attr('stroke', '#ddd');
        // baseGroup.append('text').text('Positivity Rate Threshold').attr('x', 10).attr('y', y(minTests) + 12).style('font-size', '12').style('fill', '#aaa');

        // var unloack1X = x(new Date('06-05-2020'));
        // baseGroup.append("line").attr('x1', unloack1X).attr('y1', 0).attr('x2', unloack1X).attr('y2', testSize.height - margin.top - margin.bottom).attr('stroke', '#ddd');
        // baseGroup.append('text').text('Pune unlock 1').attr('x', unloack1X).attr('y', 0).style('font-size', '12').style('fill', '#aaa');

        // var unloack2X = x(new Date('07-14-2020'));
        // baseGroup.append("line").attr('x1', unloack2X).attr('y1', 0).attr('x2', unloack2X).attr('y2', testSize.height - margin.top - margin.bottom).attr('stroke', '#ddd');
        // baseGroup.append('text').text('Pune unlock 2').attr('x', unloack2X).attr('y', 0).style('font-size', '12').style('fill', '#aaa');
        // // Add the X Axis
        baseGroup.append("g").attr("transform", "translate(0," + (crHeight - margin.top - margin.bottom) + ")").call(d3.axisBottom(x)).selectAll("text").text(function(d) { return formatTime(d); }).style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
        // // Add the Y Axis
        baseGroup.append("g").call(d3.axisLeft(y).ticks(8)).selectAll("text").text(function(d) { return d + '%'; });
        // testControls.on('click', handleTestControlClick);
    }
    crDataControls.on('click', handlecrDataControlsClick);
    function handlecrDataControlsClick() {
        var d3this = d3.select(this);
        if (d3this) {
            crDataControls.classed('selected', false);
            d3this.classed('selected', true);
            crActiveType = d3this.attr('data-type');
            rendercr();
            updatedTitle('cr', tlsNsubTls.healthcareCapacity.cr[crActiveType]);
        }
    }
    crControls.on('click', lineChange);
    // d3.select('#crCfrTitle').text(tlsNsubTls.healthcareCapacity.criticalPatientsAndDeaths.cr.heading);
    function lineChange() {
        var d3this = d3.select(this);
        if (!d3this.classed('selected')) {
            crControls.classed('selected', false);
            d3this.classed('selected', true);
            crActiveData = d3this.attr('data-sort');
            // d3.select('#crCfrTitle').text(tlsNsubTls.healthcareCapacity.criticalPatientsAndDeaths[crActiveType].heading);
            rendercr();
        }
    }


    

    /////////////////////////////////////////////////////////////////////////// MICRONARRATIVES BAR GRAPHS
    var mB1  = d3.select('#micro-bargraph-1').select('.chart-wrapper');
    var mWidth      = parseInt($('#micro-bargraph-1').find('.chart-wrapper').width());
    var mHeight     = parseInt(mWidth * .65);

    var mB1Svg = mB1.append('svg').attr('width', mWidth).attr('height', mHeight);
    var mB1Data = [
        { ageGroup: '60+',          tiredness: 28, difficultyInBreathing: 4},
        { ageGroup: '40 to 59',     tiredness: 20, difficultyInBreathing: 2},
        { ageGroup: '20 to 39',     tiredness: 12, difficultyInBreathing: 1},
        { ageGroup: 'Less than 20', tiredness: 10, difficultyInBreathing: 1}
    ];
    var mBHeight = (mHeight - 60) / (mB1Data.length * 2) - 2;
    var max = d3.max(mB1Data, function(d) { if(d['tiredness'] > d['difficultyInBreathing']) { return d['tiredness']; } return d['difficultyInBreathing'] });
    var xScale = d3.scaleLinear().domain([0, max]).range([0, (mWidth - 120)]);
    var mB1Colors = { tiredness: '#4E4DB0', difficultyInBreathing: '#8382C7' };
    
    var mB1BaseGroup = mB1Svg.append('g').attr('transform', 'translate(' + 90 + ',' + 10 + ')');
    for(var i = 0, len = mB1Data.length; i < len; i++)
    {
        var mB1BaseG = mB1BaseGroup.append('g').attr('class', 'base-group-' + i).attr('transform', 'translate(0,' + (i * (mHeight - 60) / mB1Data.length) + ')');
        mB1BaseG.append('rect').attr('x', 0).attr('y', 0).attr('height', mBHeight).attr('width', xScale(mB1Data[i]['tiredness'])).attr('fill', mB1Colors['tiredness']);
        mB1BaseG.append('text').text(mB1Data[i]['tiredness'] + '%').attr('y', (mBHeight / 2 + 5)).attr('x', xScale(mB1Data[i]['tiredness']) + 5);
        mB1BaseG.append('rect').attr('x', 0).attr('y', mBHeight + 2).attr('height', mBHeight).attr('width', function() { return xScale(mB1Data[i]['difficultyInBreathing']); }).attr('fill', mB1Colors['difficultyInBreathing']);
        mB1BaseG.append('text').text(mB1Data[i]['difficultyInBreathing'] + '%').attr('y', (mBHeight * 1.5 + 5)).attr('x', xScale(mB1Data[i]['difficultyInBreathing']) + 5);
        mB1BaseG.append('text').text(mB1Data[i]['ageGroup']).attr('text-anchor', 'end').attr('transform', 'translate(-20,' + (mBHeight + 5) + ')');
    }
    mB1BaseGroup.append("g").attr("transform", "translate(0," + (mHeight - 60) + ")").call(d3.axisBottom(xScale));
    mB1BaseGroup.append("line").attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', mHeight - 60).attr('stroke', '#aaa');
    mB1Svg.append('rect').attr('x', 90).attr('y', mHeight - 20).attr('width', 14).attr('height', 14).attr('fill', mB1Colors['tiredness']);
    mB1Svg.append('text').text('Tiredness').attr('x', 110).attr('y', mHeight - 8).attr('fill', mB1Colors['tiredness']);
    mB1Svg.append('rect').attr('x', 180).attr('y', mHeight - 20).attr('width', 14).attr('height', 14).attr('fill', mB1Colors['difficultyInBreathing']);
    mB1Svg.append('text').text('Difficulty In Breathing').attr('x', 200).attr('y', mHeight - 8).attr('fill', mB1Colors['difficultyInBreathing']);




    var mB2 = d3.select('#micro-bargraph-2').select('.chart-wrapper');
    var mB2Svg = mB2.append('svg').attr('width', mWidth).attr('height', mHeight);
    var mB2Margin = {left: (mWidth * .45), top: 20, bottom: 60, right: 50};
    max = 0;
    var mB2Data = [
        { field: 'Very high Infectivity', value: 37.9},
        { field: 'Fear/anxiety of disease', value: 20.7},
        { field: 'Lack of knowledge due to novelty', value: 17.2},
        { field: 'Higher mortality, longer recovery', value: 10.3},
        { field: 'High risk for compromised patients', value: 6.9},
        { field: 'Unpredictable nature', value: 6.9},
    ];
    max = d3.max(mB2Data, function(d) { return d.value + 3; });
    var xScale = d3.scaleLinear().domain([0, max]).range([0, (mWidth - mB2Margin.left - mB2Margin.right)]);
    var yScale = d3.scaleBand().range([mHeight - mB2Margin.top - mB2Margin.bottom, 0]).domain(mB2Data.map(function(d) { return d.field; })).padding(0.1);
    var mB2BaseGroup = mB2Svg.append('g').attr('transform', 'translate(' + mB2Margin.left + ',' + mB2Margin.top + ')');
    mB2BaseGroup.selectAll(".bar").data(mB2Data).enter().append("rect").attr("class", "bar")
        .attr("x", 0)
        .attr("width", function(d) {return xScale(d.value); } )
        .attr("y", function(d) { return yScale(d.field); })
        .attr("height", yScale.bandwidth())
        .attr('fill', '#4E4DB0');
    // add the x Axis
    mB2BaseGroup.append("g").attr("transform", "translate(0," + (mHeight - mB2Margin.bottom - mB2Margin.top) + ")").call(d3.axisBottom(xScale));
    mB2BaseGroup.selectAll(".valueText").data(mB2Data).enter().append("text").text(function(d) { return d['value'] + '%'; }).attr('x', function(d) {return (xScale(d.value) / 2 - 16); }).attr('y', function(d) { return yScale(d['field']) + ((mHeight - mB2Margin.bottom - mB2Margin.top) / mB2Data.length) / 2; }).attr('fill', '#fff');
    mB2BaseGroup.append("g").call(d3.axisLeft(yScale));



    var mB3 = d3.select('#micro-bargraph-3').select('.chart-wrapper');
    var mB3Svg = mB3.append('svg').attr('width', mWidth).attr('height', mHeight);
    var mB3Margins = {left: 90, top: 20, bottom: 60, right: 50};
    var mB3Max = 0;
    var mB3Data = [
        { field: 'Unknown', value: 39.3},
        { field: 'Family', value: 29.4},
        { field: 'Travel', value: 20.2},
        { field: 'Gathering', value: 9.07},
        { field: 'Health worker', value: 0.02},
        { field: 'Foreign contact', value: 0.004},
    ];
    max = d3.max(mB3Data, function(d) { return d.value; });
    var xScale = d3.scaleLinear().domain([0, max]).range([0, (mWidth - mB3Margins.left - mB3Margins.right)]);
    var yScale = d3.scaleBand().range([mHeight - mB3Margins.top - mB3Margins.bottom, 0]).domain(mB3Data.map(function(d) { return d.field; })).padding(0.1);
    var mB3BaseGroup = mB3Svg.append('g').attr('transform', 'translate(' + mB3Margins.left + ',' + mB3Margins.top + ')');
    mB3BaseGroup.selectAll(".bar").data(mB3Data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("width", function(d) { if(xScale(d.value) < 1) { return xScale(d.value) * 40; } return xScale(d.value); } )
        .attr("y", function(d) { return yScale(d.field); })
        .attr("height", yScale.bandwidth())
        .attr('fill', '#4E4DB0');
    // add the x Axis
    mB3BaseGroup.append("g").attr("transform", "translate(0," + (mWidth - mB3Margins.bottom - mB3Margins.top) + ")").call(d3.axisBottom(xScale));
    mB3BaseGroup.selectAll(".valueText").data(mB3Data).enter().append("text").text(function(d) { return d['value'] + '%'; }).attr('x', function(d) {return (xScale(d.value) + 16); }).attr('y', function(d) { return yScale(d['field']) + ((mHeight - mB3Margins.bottom - mB3Margins.top) / mB3Data.length) / 2; }).attr('fill', '#000');
    mB3BaseGroup.append("g").call(d3.axisLeft(yScale));




    var e4 = d3.select('#micro-bargraph-4').select('.chart-wrapper');
    var e4Svg = e4.append('svg').attr('width', mWidth).attr('height', mHeight);
    var e4Margins = {left: 220, top: 20, bottom: 60, right: 50};
    var e4Max = 0;
    var e4Data = [
        { field: 'More knowledge, more confident', value: 30.4},
        { field: 'Initial fear has gone', value: 21.7},
        { field: 'Observed several new symptoms', value: 17.4},
        { field: 'Importance of health infra mgmt', value: 13},
        { field: 'Better drugs, CFR has decreased', value: 8.7},
        { field: 'Remained almost the same', value: 8.7},
    ];
    for(var i = 0, len = e4Data.length; i < len; i++){
        if (e4Data[i].value > e4Max) {
            e4Max = e4Data[i].value + 3;
        }
    }
    var xScale = d3.scaleLinear().domain([0, e4Max]).range([0, (mWidth - e4Margins.left - e4Margins.right)]);
    var yScale = d3.scaleBand().range([mHeight - e4Margins.top - e4Margins.bottom, 0]).domain(e4Data.map(function(d) { return d.field; })).padding(0.1);
    var e4BaseGroup = e4Svg.append('g').attr('transform', 'translate(' + e4Margins.left + ',' + e4Margins.top + ')');
    e4BaseGroup.selectAll(".bar").data(e4Data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("width", function(d) { if(xScale(d.value) < 1) { return xScale(d.value) * 40; } return xScale(d.value); } )
        .attr("y", function(d) { return yScale(d.field); })
        .attr("height", yScale.bandwidth())
        .attr('fill', '#4E4DB0');
    // add the x Axis
    e4BaseGroup.append("g").attr("transform", "translate(0," + (mHeight - e4Margins.bottom - e4Margins.top) + ")").call(d3.axisBottom(xScale));
    e4BaseGroup.selectAll(".valueText").data(e4Data).enter().append("text").text(function(d) { return d['value'] + '%'; }).attr('x', function(d) {return (xScale(d.value) + 16); }).attr('y', function(d) { return yScale(d['field']) + ((mHeight - e4Margins.bottom - e4Margins.top) / e4Data.length) / 2; }).attr('fill', '#000');
    e4BaseGroup.append("g").call(d3.axisLeft(yScale));




    var pr1 = d3.select('#micro-bargraph-5').select('.chart-wrapper');
    var pr1Svg = pr1.append('svg').attr('width', mWidth).attr('height', mHeight);
    var pr1Margins = {left: 220, top: 20, bottom: 60, right: 50};
    var pr1Max = 0;
    var pr1Data = [
        { field: 'Monetary support/ compensation', value: 5.4},
        { field: 'Facilities for doctors and staff', value: 8.1},
        { field: 'More manpower and staff', value: 16.2},
        { field: 'Policy consistency', value: 18.9},
        { field: 'Access to affordable drugs', value: 21.6},
        { field: 'More equipment and beds', value: 29.7},
    ];
    for(var i = 0, len = pr1Data.length; i < len; i++){
        if (pr1Data[i].value > pr1Max) {
            pr1Max = pr1Data[i].value + 3;
        }
    }
    var xScale = d3.scaleLinear().domain([0, pr1Max]).range([0, (mWidth - pr1Margins.left - pr1Margins.right)]);
    var yScale = d3.scaleBand().range([mHeight - pr1Margins.top - pr1Margins.bottom, 0]).domain(pr1Data.map(function(d) { return d.field; })).padding(0.1);
    var pr1BaseGroup = pr1Svg.append('g').attr('transform', 'translate(' + pr1Margins.left + ',' + pr1Margins.top + ')');
    pr1BaseGroup.selectAll(".bar").data(pr1Data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("width", function(d) { if(xScale(d.value) < 1) { return xScale(d.value) * 40; } return xScale(d.value); } )
        .attr("y", function(d) { return yScale(d.field); })
        .attr("height", yScale.bandwidth())
        .attr('fill', '#4E4DB0');
    // add the x Axis
    pr1BaseGroup.append("g").attr("transform", "translate(0," + (mHeight - pr1Margins.bottom - pr1Margins.top) + ")").call(d3.axisBottom(xScale));
    pr1BaseGroup.selectAll(".valueText").data(pr1Data).enter().append("text").text(function(d) { return d['value'] + '%'; }).attr('x', function(d) {return (xScale(d.value) + 16); }).attr('y', function(d) { return yScale(d['field']) + ((mHeight - pr1Margins.bottom - pr1Margins.top) / pr1Data.length) / 2; }).attr('fill', '#000');
    pr1BaseGroup.append("g").call(d3.axisLeft(yScale));




    var pr2 = d3.select('#micro-bargraph-6').select('.chart-wrapper');
    var pr2Svg = pr2.append('svg').attr('width', mWidth).attr('height', mHeight);
    var pr2Margins = {left: 140, top: 20, bottom: 60, right: 50};
    var pr2Max = 100;
    var pr2Data = [
        { type: 'Doctor (independent)', notInfected: 81, infected: 19},
        { type: 'Doctor (in hospital)', notInfected: 86, infected: 14},
        { type: 'Nurse', notInfected: 88, infected: 12},
        { type: 'Paramedical staff', notInfected: 93, infected: 7},
    ];
    var xScale = d3.scaleLinear().domain([0, 100]).range([0, (mWidth - pr2Margins.left - pr2Margins.right)]);
    var yScale = d3.scaleBand().range([mHeight - pr2Margins.top - pr2Margins.bottom, 0]).domain(pr2Data.map(function(d) { return d.type; })).padding(0.1);
    var pr2BarHeight = (mHeight - pr2Margins.top - pr2Margins.bottom) / 4 - 2;
    var pr2BaseGroup = pr2Svg.append('g').attr('class', 'base-group').attr('transform', 'translate(' + pr2Margins.left + ',' + pr2Margins.top + ')');
    var pr2Colors = { notInfected: '#4E4DB0', infected: '#8382C7' };
    for(var i = 0, len = pr2Data.length; i < len; i++)
    {
        var baseG = pr2BaseGroup.append('g').attr('transform', 'translate(0,'+ (i * (mHeight - pr2Margins.top - pr2Margins.bottom) / 4) +')');
        baseG.append('rect').attr('x', 0).attr('y', 0).attr('width', function() { return xScale(pr2Data[i]['notInfected']); }).attr('height', pr2BarHeight).attr('fill', pr2Colors['notInfected']);
        baseG.append('text').text(pr2Data[i]['notInfected'] + '%').attr('x', function() { return (xScale(pr2Data[i]['notInfected']) / 2 - 5); }).attr('y', (pr2BarHeight / 2 + 5)).style('fill', '#fff');
        baseG.append('rect').attr('x', function() { return xScale(pr2Data[i]['notInfected']); }).attr('y', 0).attr('width', function() { return xScale(pr2Data[i]['infected']); }).attr('height', pr2BarHeight).attr('fill', pr2Colors['infected']);
        baseG.append('text').text(pr2Data[i]['infected'] + '%').attr('x', function() { return (xScale(pr2Data[i]['notInfected']) + xScale(pr2Data[i]['infected']) / 2 - 5); }).attr('y', (pr2BarHeight / 2 + 5)).style('fill', '#fff');
    }
    pr2BaseGroup.append('g').call(d3.axisLeft(yScale));
    pr2Svg.append('rect').attr('width', 14).attr('height', 14).attr('y', mHeight - 44).attr('x', pr2Margins.left).attr('fill', pr2Colors['notInfected']);
    pr2Svg.append('text').text('Not Infected').attr('y', mHeight - 32).attr('x', pr2Margins.left + 20).attr('fill', pr2Colors['notInfected']);
    pr2Svg.append('rect').attr('width', 14).attr('height', 14).attr('y', mHeight - 24).attr('x', pr2Margins.left).attr('fill', pr2Colors['infected']);
    pr2Svg.append('text').text('Infected').attr('y', mHeight - 12).attr('x', pr2Margins.left + 20).attr('fill', pr2Colors['infected']);



    var pr3 = d3.select('#micro-bargraph-7').select('.chart-wrapper');
    var pr3Svg = pr3.append('svg').attr('width', mWidth).attr('height', mHeight);
    var pr3Margins = {left: 220, top: 20, bottom: 60, right: 50};
    var pr3Max = 0;
    var pr3Data = [
        { field: 'Worried about infecting family', value: 27.7},
        { field: 'Not personally affected', value: 25},
        { field: 'Initially/sometimes anxious', value: 22.2},
        { field: 'Affected by patient suffering', value: 11},
        { field: 'Uncertainty if doctor’s academics / exams', value: 5.6},
        { field: 'Managing hospital logistics and politics', value: 5.6},
        { field: 'Working in isolation, away from family', value: 2.7},
    ];
    for(var i = 0, len = pr3Data.length; i < len; i++){
        if (pr3Data[i].value > pr3Max) {
            pr3Max = pr3Data[i].value;
        }
    }
    var xScale = d3.scaleLinear().domain([0, pr3Max]).range([0, (mWidth - pr3Margins.left - pr3Margins.right)]);
    var yScale = d3.scaleBand().range([mHeight - pr3Margins.top - pr3Margins.bottom, 0]).domain(pr3Data.map(function(d) { return d.field; })).padding(0.1);
    var pr3BarHeight = (mHeight - pr3Margins.top - pr3Margins.bottom) / 4 - 2;
    var pr3BaseGroup = pr3Svg.append('g').attr('class', 'base-group').attr('transform', 'translate(' + pr3Margins.left + ',' + pr3Margins.top + ')');
    var pr3Colors = { notInfected: '#4EBFFF', infected: '#283593' };
    pr3BaseGroup.selectAll(".bar").data(pr3Data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("width", function(d) { return xScale(d.value); })
        .attr("y", function(d) { return yScale(d.field); })
        .attr("height", yScale.bandwidth())
        .attr('fill', '#4E4DB0');
    pr3BaseGroup.selectAll('.value').data(pr3Data).enter().append('text').text(function(d) { return d['value']; }).attr('x', function(d) { return xScale(d.value) + 5; }).attr('y', function(d) { return yScale(d.field) + 20; });
    pr3BaseGroup.append("g").attr("transform", "translate(0," + (mHeight - pr3Margins.bottom - pr3Margins.top) + ")").call(d3.axisBottom(xScale));
    pr3BaseGroup.append('g').call(d3.axisLeft(yScale));



    /////////////////////////////////////////////////////////////////////////// ADDITIONAL SETTINGS
    $('.main-links').on('click', function (evt) {
        evt.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 800);
    });

    $('.popup-trigger').on('click', function (evt) {
        evt.preventDefault();
        var $target = $(this).attr('href');
        $($target).addClass('active');
    });

    $('.popup .close').on('click', function(evt) {
        evt.preventDefault();
        $(this).closest('.popup').removeClass('active');
    });
    

});