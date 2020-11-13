//  Does not work with `new (funcA.bind(thisArg, args))`
if (!Function.prototype.bind) (function () {
    var slice = Array.prototype.slice;
    Function.prototype.bind = function () {
        var thatFunc = this, thatArg = arguments[0];
        var args = slice.call(arguments, 1);
        if (typeof thatFunc !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - ' +
                'what is trying to be bound is not callable');
        }
        return function () {
            var funcArgs = args.concat(slice.call(arguments))
            return thatFunc.apply(thatArg, funcArgs);
        };
    };
})();



/////////////////////////////////////////////////////////////////////////// COMMON USEFUL FUNCTIONS
var LineChart = function (id, margins, h) {
    margins = margins || { left: 50, top: 50, right: 50, bottom: 50 };
    h = h || .6;

    var wW = d3.select('body').node().getBoundingClientRect().width;
    if(wW < 400) {
        h = .9;
    } else if(wW < 600) {
        h = .8;
    } else if(wW < 1200) {
        h = .7;
    }

    var lineObj = {
        h: h,
        tooltip: null,
        wrapper: null,
        svg: null,
        baseGroup: null,
        data: null,
        xKey: null,
        loadData: null,
        width: null,
        height: null,
        margins: margins,
        lastDate: null,
        lastWeek: null,
        lastMonth: null,
        activeType: null,
        activeSort: 'all',
        allLines: [],
        activeSortBtns: null,
        init: function (data) {
            var that = this;
            this.wrapper = d3.select('#' + id).select('.chart-box');
            this.width = parseInt($('#' + id).find('.chart-box').width());
            this.height = parseInt(this.width * h);

            this.addXAxis.bind(this);
            this.addYAxis.bind(this);
            this.createSvg.bind(this);
            this.setBaseGroup.bind(this);
            this.setSize.bind(this);
            this.createLine.bind(this);

            this.data           = data;
            this.lastDate       = this.data[this.data.length - 1].date;
            var oneMonthAgo     = this.lastDate.getTime() - 2592000000;
            var oneWeekAgo      = this.lastDate.getTime() - 604800000;

            this.activeSortBtns = d3.select('#' + id).select('.sort-control').selectAll('button');
            this.activeSortBtns.on('click', function(evt) { that.handleSortClick(this, that); });

            for(var i = 0, len  = this.data.length; i < len; i++)
            {
                var thisTime = this.data[i].date.getTime();
                if (!this.lastMonth && thisTime > oneMonthAgo) {
                    this.lastMonth = this.data.slice((i - 1));
                }
                if(!this.lastWeek && thisTime > oneWeekAgo) {
                    this.lastWeek = this.data.slice((i - 1));
                }
            }

            this.createSvg().setSize().setBaseGroup();
            return this;
        },
        createSvg: function () {
            this.svg = this.wrapper.append('svg');
            return this;
        },
        setBaseGroup: function () {
            this.baseGroup = this.svg.append('g').attr('class', 'baseGroup').attr('transform', 'translate(' + this.margins.left + ',' + this.margins.top + ')');
            return this;
        },
        setSize: function () {
            this.svg.attr('width', this.width).attr('height', this.height);
            return this;
        },
        addXAxis: function (xTimeFormat) {
            var that = this;
            var formatTime = d3.timeFormat(xTimeFormat);
            this.xAxis = this.baseGroup.append("g").attr('class', 'xAxis').attr("transform", "translate(0," + (that.height - that.margins.top - that.margins.bottom) + ")").call(d3.axisBottom(that.x)).selectAll("text").text(function(d) { return formatTime(d); }).style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)");
            return this;
        },
        addYAxis: function (axis, ticks) {
            ticks   = ticks || 5;
            axis    = axis  || 'right';
            var that = this;

            var thisAxis = axis === 'left' ? d3.axisLeft(that.y).ticks(ticks) : d3.axisRight(that.y).ticks(ticks);

            this.baseGroup.append("g").call(thisAxis).attr('transform', function() { if(axis === 'right') { return 'translate(' + (that.width - that.margins.right - that.margins.left ) + ', 0)'; } return 'translate(o,o)'; }).selectAll("text").text(function(d) { return d + '%'; });
            return this;
        },
        createLine: function (yVal, addToY, color) {
            var that    = this;
            var data    = null;
            if(this.activeSort === 'all') {
                data = that.data;
            } else if(this.activeSort === 'lastMonth') {
                data = that.lastMonth;
            } else if(this.activeSort === 'lastWeek') {
                data = that.lastWeek;
            }
            this.x      = d3.scaleTime().range([0, that.width - that.margins.left - that.margins.right]).domain([data[0]['date'], that.lastDate]);
            var max     = d3.max(data, function(d) { return d[yVal]; });
            this.y      = d3.scaleLinear().range([that.height - that.margins.top - that.margins.bottom, 0]).domain([0, max + addToY]);

            var valueline   = d3.line().x(function(d) { return that.x(d.date); }).y(function(d) { return that.y(d[yVal]); });
            var line        = that.baseGroup.append("path").data([data]).attr("class", "line").attr("d", valueline).attr('stroke', color);

            this.allLines.push(line);

            return that;
        },
        handleSortClick: function (ye, wo) {
            var d3this = d3.select(ye);
            var sort = d3this.attr('data-sort');
            if(sort !== wo.activeSort)
            {
                wo.activeSortBtns.classed('selected', false);
                d3this.classed('selected', true);
                wo.activeSort = sort;
            }
            var data    = null;
            if(this.activeSort === 'all') {
                data = wo.data;
            } else if(this.activeSort === 'lastMonth') {
                data = wo.lastMonth;
            } else if(this.activeSort === 'lastWeek') {
                data = wo.lastWeek;
            }
            wo.x = d3.scaleTime().range([0, wo.width - wo.margins.left - wo.margins.right]).domain([data[0]['date'], wo.lastDate]);
            wo.xAxis.transition().duration(3000).call(d3.axisBottom(wo.x));
        }
    };
    return lineObj;
};




var CityMap = function (h) {
    h = h || .64;

    var wW = d3.select('body').node().getBoundingClientRect().width;
    if(wW < 400) {
        h = 1.1;
    } else if(wW < 600) {
        h = .9;
    } else if(wW < 1200) {
        h = .8;
    }

    var mapObj = {
        h: h,
    	tooltip: null,
        wrapper: null,
        svg: null,
        baseGroup: null,
        data: null,
        width: null,
        height: null,
        color: null,
        activeType: null,
        init: function (id, activeType, typeControls, color, titles, isSmall, wrapperClass) {
            var selectedId = d3.select('#' + id);
            this.isSmall = isSmall || false;
            wrapperClass = wrapperClass || '.chart-box';

            this.color = color || '#eee';
            this.titles = titles;
            this.id = id;

            this.wrapper = selectedId.select(wrapperClass);
            this.tooltip = selectedId.select('.data-wiz .color');
            this.width = parseInt($('#' + id).find('.chart-box').width());
            this.height = parseInt(this.width * h);

            this.activeType = activeType;

            if(typeControls) {
                this.typeControls = selectedId.select('.type-control').selectAll('button');
                // this.typeControlsClick.bind(this);
            }

            this.createSvg.bind(this);
            this.setBaseGroup.bind(this);
            this.setSize.bind(this);
            this.createMap.bind(this);
            this.getScale.bind(this);
            this.updateColor.bind(this);
            this.updateTitles.bind(this);

            this.createSvg().setSize().setBaseGroup();
            return this;
        },
        getScale: function () {
            if (this.width < 330) {
                return 70000;
            } else if (this.width < 400) {
                return 72000;
            } else if (this.width < 600) {
                return 106000;
            } else {
                return 110000;
            }
        },
        createSvg: function () {
            this.svg = this.wrapper.append('svg');
            return this;
        },
        setBaseGroup: function () {
            this.baseGroup = this.svg.append('g').attr('class', 'baseGroup');
            return this;
        },
        setSize: function () {
            this.svg.attr('width', this.width).attr('height', this.height);
            return this;
        },
        createMap: function (areaData, data, addHoverData) {
            var that = this;
            this.data = data;

            var min = d3.min(data, function (d) { return +d[that.activeType]; });
            var max = d3.max(data, function (d) { return +d[that.activeType]; });
            var opacityRange = d3.scaleLinear().domain([min, max]).range([20, 100]);

            this.group = this.baseGroup.selectAll("g").data(areaData).enter().append("g");
            var translateX = this.width < 769 ? this.width / 2 - 12 : this.width / 2 - 30;
            var projection = d3.geoMercator().scale(this.getScale()).center([73.856255, 18.516726]).translate([translateX, this.height / 2]);
            var path = d3.geoPath().projection(projection);
            this.prabhags = this.group.append("path").attr("d", path).style('opacity', function (d, i) { return opacityRange(data[i][that.activeType]) / 100; }).style('fill', that.color);
            if (addHoverData.length > 0) {
                for (var i = 0, len = addHoverData.length; i < len; i++) {
                    this.prabhags.attr("data-" + addHoverData[i], function (d, j) { return data[j][addHoverData[i]]; });
                }
            }
            
            this.prabhags.on('mouseenter', function() { that.showTooltip(this, that); });
            this.prabhags.on('click', function() { that.showTooltip(this, that); });
            this.prabhags.on('mouseleave', function() { that.hideTooltip(this, that); });
            if(this.typeControls) {
                this.typeControls.on('click', function(evt) { that.typeControlsClick(this, that); });
            }
            return this;
        },
        updateColor: function() {
        	var that = this;
        	var min = d3.min(this.data, function (d) { return +d[that.activeType]; });
            var max = d3.max(this.data, function (d) { return +d[that.activeType]; });
            var opacityRange = d3.scaleLinear().domain([min, max]).range([20, 100]);
            this.prabhags.style('opacity', function (d, i) { return opacityRange(that.data[i][that.activeType]) / 100; }).style('fill', that.color);
        },
        typeControlsClick: function(ye, wo) {
            var d3this = d3.select(ye);
            var type = d3this.attr('data-type');
            if(type !== wo.activeType) {
                wo.typeControls.classed('selected', false);
                d3this.classed('selected', true);
                wo.activeType = type;
                wo.updateColor();
                wo.updateTitles();
            }
        },
        showTooltip: function(ye, wo) {
            ye = d3.select(ye);
            if(!wo.tooltip.classed('active')) {
                wo.tooltip.classed('active', true);
                wo.tooltip.select('p').text(ye.attr('data-name'));
                wo.tooltip.select('h1').text(ye.attr('data-' + wo.activeType));
            }
        },
        hideTooltip: function(ye, wo) {
            if(wo.tooltip.classed('active')) {
                wo.tooltip.classed('active', false);
                wo.tooltip.select('p').text('');
                wo.tooltip.select('h1').text('');
            }
        },
        updateTitles: function() {
            if (this.titles && this.titles[this.activeType]) {
                console.log(this.id);
                if(this.titles[this.activeType].heading) {
                    $('#' + this.id).find('header h1').text(this.titles[this.activeType].heading);
                }
                if(this.titles[this.activeType].sub) {
                    $('#' + this.id).find('header h1').text(this.titles[this.activeType].sub);
                }
            }
        }
    };
    return mapObj;
}