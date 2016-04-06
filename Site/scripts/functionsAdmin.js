function getAllBuyerLocations(targetSelect) {
    buyerLocationsHtml = '<option>Select a Location:</option>', dto = { "Key": _key, "ContractID": contractID }, data = JSON.stringify(dto);
    $.ajax('../api/Contract/BuyerLocations', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            resultsLocations = msg['ReturnData'];
            for (var i = 0; i < resultsLocations.length; i++) {
                buyerLocationsHtml += '<option value="' + resultsLocations[i].LocationId + '">' + resultsLocations[i].LocationName + '</option>';
            }
            $(targetSelect).empty().html(buyerLocationsHtml);
        }
    });
}

function getAllAdminLocations(targetSelect){
    showProgress('body');
    var buyerLocationsHtml = '<option>Select a Location:</option>', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/LocationList', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                buyerLocationsHtml += '<option value="' + results[i].LocationId + '">' + results[i].SKUName + '</option>';
            }
            $(targetSelect).empty().html(buyerLocationsHtml);
            hideProgress();
        }
    });
}

function getContractList() {
    showProgress('body');
    var contractListHtml = '', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Contract/GetLast60DaysContracts', {
        type: 'POST',
        data: data,
        success: function (msg) {
            var contractIcon;
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                switch (results[i].StatusName.toLowerCase().split(' ')[0]) {
                    case "new": contractIcon = '<i class="fa fa-hand-o-right" title="new"></i>'; break;
                    case "open": contractIcon = '<i class="fa fa-edit" title="open"></i>'; break;
                    case "out": contractIcon = '<i class="fa fa-usd" title="out-to-bid"></i><a href="#" class="compReport"  data-headertext="' + results[i].ContractName +  '(' + results[i].ContractTypeName + ') [' + results[i].StartDate.split(' ')[0] + ' until ' + results[i].EndDate.split(' ')[0] + ']' + '"  data-contractid="' + results[i].ContractId + '"><i class="fa fa-eye" title="View Comparison Report"></i></a><a href="#" class="contractCharts"  data-headertext="' + results[i].ContractName +  '(' + results[i].ContractTypeName + ') [' + results[i].StartDate.split(' ')[0] + ' until ' + results[i].EndDate.split(' ')[0] + ']' + '" data-contractid="' + results[i].ContractId + '"><i class="fa fa-bar-chart" title="View Charts"></i></a>'; break;
                    case "closed": contractIcon = '<i class="fa fa-check-square-o" title="closed"></i><a href="#" class="compReport" data-headertext="' + results[i].ContractName +  '(' + results[i].ContractTypeName + ') [' + results[i].StartDate.split(' ')[0] + ' until ' + results[i].EndDate.split(' ')[0] + ']' + '" data-contractid="' + results[i].ContractId + '"><i class="fa fa-eye" title="View Comparison Report"></i></a><a href="#" class="contractCharts" data-headertext="' + results[i].ContractName +  '(' + results[i].ContractTypeName + ') [' + results[i].StartDate.split(' ')[0] + ' until ' + results[i].EndDate.split(' ')[0] + ']' + '" data-contractid="' + results[i].ContractId + '"><i class="fa fa-bar-chart" title="View Charts"></i></a>'; break;
                    default: contractIcon = '<i class="fa fa-caret-square-o-right"></i>';
                }
                contractListHtml += '<li class="status-' + results[i].StatusName.replace(/\s/g, "").toLowerCase() + '">' + contractIcon + '<a href="#" data-headertext="' + results[i].ContractName +  '(' + results[i].ContractTypeName + ') [' + results[i].StartDate.split(' ')[0] + ' until ' + results[i].EndDate.split(' ')[0] + ']' + '"data-contractstatus="' + results[i].StatusName + '" data-contractname="' + results[i].ContractName + '" data-contractid="' + results[i].ContractId + '" data-contracttypeid="' + results[i].ContractTypeId + '">' + results[i].ContractName + '</a> (' + results[i].ContractTypeName + ') [' + results[i].StartDate.split(' ')[0] + ' until ' + results[i].EndDate.split(' ')[0] + ']</li>';
            }
            $.when($('#contractList ul').empty().html(contractListHtml)).then(function () {
                $('#contractList').fadeIn('20');
                hideProgress();

                $('#contractList a').click(function (e) {
                    e.preventDefault();
                    var contractID = $(this).data('contractid');
                    var headertext = $(this).data('headertext');
                    $('#h2Comparison').data('contractid', contractID);
            
                    if ($(this).hasClass("compReport")) {
                        $('#contractList').fadeOut('20', function () {
                            $('#comparisonReport').fadeIn('20');
                            if (userType == 'Admin') getLocationsDDL('#location2DDL'); else if(userType='Buyer') getAllBuyerLocations('#location2DDL');
                            $('#h2Comparison').empty().append(headertext);
                            viewComparisonReport(contractID , - 1);
                            
                        });
                    }
                    else if ($(this).hasClass("contractCharts")) {
                        $('#contractList').fadeOut('20', function () {
                            $('#contractCharts').fadeIn('20');
                            if (userType == 'Admin') getLocationsDDL('#location3DDL'); else if (userType = 'Buyer') getAllBuyerLocations('#location3DDL');
                            $('#h2contractCharts').empty().append(headertext);
                            viewContractCharts(contractID, -1);

                        });
                    }
                    else
                    {
                    var contractStatus = $(this).data('contractstatus'), contractName = $(this).data('contractname'), contractTypeID = $(this).data('contracttypeid');
                    
                    $('#contractList').fadeOut('20', function () {                        
                        switch (userType) {
                            case "Buyer":
                                $('#buyerEditContractH2').empty().append(headertext);
                                viewBuyerContractPrices(contractStatus.replace(/\s/g, "").toLowerCase(), contractID);
                                break;
                            case "Vendor":
                                $('#vendorEditContractH2').empty().append(headertext);
                                loadVendorView(contractStatus.replace(/\s/g, "").toLowerCase(), contractID, contractName);
                                break;
                            case "Admin":
                                $('#editHeaderH2').empty().append(headertext);
                                fillContractVendors(contractID, contractStatus, contractName, contractTypeID);
                                break;
                        }
                    });
                }
                });
            });
        }
    });
}

function getContractTypes(targetSelect) {
    var contractTypesHtml = '<option value="0">Select SKU Category:</option>', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/GetContractTypes', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                contractTypesHtml += '<option value="' + results[i].ContractTypeId + '">' + results[i].ContractTypeName + '</option>';
            }
            $(targetSelect).empty().html(contractTypesHtml);
        }
    });
}

function getBuyerCompanies(targetSelect) {
    var buyerCompaniesHtml = '<option value="0">Select Company:</option>', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/LocationCompanyLookup', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                buyerCompaniesHtml += '<option value="' + results[i].CompanyId + '">' + results[i].CompanyName + '</option>';
            }
            $(targetSelect).empty().html(buyerCompaniesHtml);
        }
    });
}

function getBuyerCompaniesAll(targetSelect) {
    var buyerCompaniesHtml = '<option value="0">Select Company:</option>', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/LocationCompanyLookupAll', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                buyerCompaniesHtml += '<option value="' + results[i].CompanyId + '">' + results[i].CompanyName + '</option>';
            }
            $(targetSelect).empty().html(buyerCompaniesHtml);
        }
    });
}

function getSKUs(contractTypeID) {
    var skuListHtml = '', dto = { "Key": _key, "ContractType": contractTypeID }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/SKUList', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                skuListHtml += '<li><a href="#" data-id="' + results[i].SKUId + '">' + results[i].SKUName + '</a>';
            }
            $('#skuSearch ul').empty().html(skuListHtml);
            $('#skuSearch a').unbind().click(function (e) {
                e.preventDefault();
                $('#SKUName').val($(this).text());
                $('#SKUID').val($(this).data('id'));
            });
        }
    });
}

function getLocations() {
    var locationListHtml = '', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/LocationList', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                locationListHtml += '<li><a href="#" data-id="' + results[i].LocationId + '"  data-companyname="' + results[i].CompanyName + '">' + results[i].SKUName + '</a></li>';
            }
            $('#locationSearch ul').empty().html(locationListHtml);
            $('#locationSearch a').unbind().click(function (e) {
                e.preventDefault();
                var x = $(this).data('companyname'), targetstring = $(this).text(), newtargetstring = targetstring.replace(x + ' - ', ''); 
                $('#LocationName').val(newtargetstring);
                $('#LocationID').val($(this).data('id'));
                $('#buyerCompanies option').filter(function () { return $(this).html() == x; }).attr('selected', true);
            });
        }
    });
}

function getZoneLocations() {
    showProgress('body');
    var locationListHtml = '', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Contract/VendorZones', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            var zoneDDL = '<select class="vendor-zones"><option value="0">Select a Zone</option>';
            for (var i = 0; i < results.length; i++) {
                zoneDDL += '<option data-vendorcompanyid="' + results[i].VendorCompanyID + '"  data-vendorzoneid="' + results[i].VendorZoneID + '" value="' + results[i].VendorZoneID + '">' + results[i].ZoneName + '</option>';
            }
            zoneDDL += '</select>';

            $.ajax('../api/Utilities/VendorLocationList', {
                type: 'POST',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg['ReturnData'];
                    for (var i = 0; i < results.length; i++) {
                        locationListHtml += '<li data-locationid="' + results[i].LocationId + '"  data-vendorzone="' + results[i].VendorZoneId + '">' + "<span>" + results[i].SKUName + "</span>" + zoneDDL + '</li>';
                    }
                    var locationsList = '<h2>Assign Locations to Zones</h2><ul id="locationsList">';
                    locationsList += locationListHtml;
                    locationsList += "</ul>";
                    $.when($('#zoneMaintenance #locations form').empty().append(locationsList)).then(function(){
                        $('#locationsList li').each(function () {
                            var zoneID = $(this).data('vendorzone');
                            $(this).find('select').val(zoneID);
                            hideProgress();
                        });
                    });

                    $('.vendor-zones').change(function (e) {
                        e.preventDefault();
                        var vendorCompanyID = $(this).find('option:selected').data('vendorcompanyid'), vendorZoneID = $(this).find('option:selected').data('vendorzoneid'), locationID = $(this).parent().data('locationid'), dto = { "Key": _key, "VendorCompanyID": vendorCompanyID, "VendorZoneID": vendorZoneID, "LocationID": locationID }, data = JSON.stringify(dto);
                        $.ajax('../api/Contract/AssignLocationToVendorZone', {
                            type: 'PUT',
                            data: data,
                            success: function (msg) {
                                startTimer(msg['Key']);
                                results = msg;
                                $.when($('.admin').fadeOut('20')).then(function () {
                                    $('#zoneMaintenance').fadeIn('20');
                                    zoneMaint();
                                });
                            },
                            error: function (msg) {
                                results = msg;
                                alert("The location zone was not changed. Please contact Stimulant Group if this continues to occur.")
                            }
                        });
                    });
                }
            });
        }
    });
}

function getLocationsDDL(targetSelect) {
    var locationListHtml = '<option value="-1">Select Location:</option>', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/LocationList', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                locationListHtml += '<option value="' + results[i].LocationId + '">' + results[i].SKUName + '</option>';
            }
            $(targetSelect).empty().html(locationListHtml);
        }
    });
}

function getUsers() {
    showProgress('body');
    var userListHtml = '', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/UserList', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                userListHtml += '<li><a href="#" data-userid="' + results[i].UserId + '">' + results[i].Name + ' (' + results[i].CompanyName + ')</a></li>';
            }
            $.when($('#userSearch ul').empty().html(userListHtml)).then(function () {
                hideProgress();
                $('#userSearch a').unbind().click(function (e) {
                    e.preventDefault();
                    $('.searchbox li > i').remove();
                    $(this).parent().prepend('<i class="fa fa-check"></i>');
                    dto = { "Key": _key, "UserId": $(this).data('userid') }, data = JSON.stringify(dto);
                    $.ajax('../api/Utilities/UserDetails', {
                        type: 'POST',
                        data: data,
                        success: function (msg) {
                            startTimer(msg['Key']);
                            results = msg['ReturnData'];
                            $('#UserName').val(results[0].UserName);
                            $('#UserId').val(results[0].UserId);
                            $('#mxContactId').val(results[0].mxContactId);
                            $('#RoleId option').filter(function () { return $(this).val() == results[0].RoleId; }).attr('selected', true);
                            $('#StatusId option').filter(function () { return $(this).val() == results[0].StatusId; }).attr('selected', true);

                            getUserLocations('#locationsList', results[0].UserId);
                        }
                    });
                });
            });
        }
    });
}

function getUserRoles(targetSelect, roleID) {
    var dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/GetUserRoles', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            var userRolesHtml = '<option>USER ROLE:</option>', results = msg['ReturnData'];
            for (var i = 0; i < results.length ; i++) {
                if (roleID == results[i].RoleID) {
                    userRolesHtml += '<option value="' + results[i].RoleId + '" selected>' + results[i].RoleNameName + '</option>';
                } else {
                    userRolesHtml += '<option value="' + results[i].RoleId + '">' + results[i].RoleNameName + '</option>';
                }
            }
            $(targetSelect).empty().html(userRolesHtml);
        }
    });
}

function getUserLocations(targetSelect, userID) {
    var locationListHtml = '', dto = { "Key": _key, "UserId": userID }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/GetAllLocationsByUser', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            currentTrue = msg['ReturnData2'];
            for (var i = 0; i < results.length; i++) {
                locationListHtml += '<li><label><input type="checkbox" name="LocationsArray" value="' + results[i].LocationId + '" ';
                if (currentTrue.indexOf(parseInt(results[i].LocationId)) > -1) locationListHtml += 'checked="true"';
                locationListHtml += '/>' + results[i].LocationName + '</li>';
            }
            $(targetSelect).empty().html(locationListHtml);
        }
    });
}

function getNewSKUsByType(targetSelect, contractTypeID) {
    var contractSKUsHtml = '', dto = { "Key": _key, "ContractType": contractTypeID }, data = JSON.stringify(dto);
    $.ajax('../api/Contract/ContractSKUsByType', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                contractSKUsHtml += '<li><input type="checkbox" value="' + results[i].SKUId + '" checked /><span>' + results[i].SKUName + '</span></li>';
            }
            $(targetSelect).empty().html(contractSKUsHtml);
        }
    });
}

function getSKUsByType(targetSelect, contractTypeID, contractID) {
    var contractSKUsHtml = '', dto = { "Key": _key, "ContractType": contractTypeID }, data = JSON.stringify(dto);
    $.ajax('../api/Contract/ContractSKUsByType', {
        type: 'POST',
        data: data,
        success: function (msg) {
            listResults=msg['ReturnData'];
            dto = { "Key": _key, "ContractId": contractID }, data = JSON.stringify(dto);
            $.ajax('../api/Contract/ContractSKUs', {
                type: 'POST',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg['ReturnData'];
                    for (var i = 0; i < listResults.length; i++) {
                        if ($.inArray(parseInt(listResults[i].SKUId), results) > -1) {
                            contractSKUsHtml += '<li><input type="checkbox" value="' + listResults[i].SKUId + '" checked=checked /><span>' + listResults[i].SKUName + '</span></li>';
                        } else {
                            contractSKUsHtml += '<li><input type="checkbox" value="' + listResults[i].SKUId + '" /><span>' + listResults[i].SKUName + '</span></li>';
                        }
                    }
                    $(targetSelect).empty().html(contractSKUsHtml);
                }
            });
        }
    });
}

function getNewVendors(targetSelect) {
    var contractVendorsHtml='' , dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/GetVendors', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                contractVendorsHtml += '<li><input type="checkbox" value="' + results[i].VendorCompanyId + '" checked /><span>' + results[i].VendorCompanyName + '</span></li>';
            }
            $(targetSelect).empty().html(contractVendorsHtml);
        }
    });
}

function getVendors(targetSelect, contractID) {
    var contractVendorsHtml = '', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/GetVendors', {
        type: 'POST',
        data: data,
        success: function (msg) {
            listResults = msg['ReturnData'];
            dto = { "Key": _key, "ContractId": contractID }, data = JSON.stringify(dto);
            $.ajax('../api/Contract/ContractVendorIds', {
                type: 'POST',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg['ReturnDataStrings'];
                    for (var i = 0; i < listResults.length; i++) {
                        if ($.inArray(listResults[i].VendorCompanyId, results) > -1) {
                            contractVendorsHtml += '<li><input type="checkbox" value="' + listResults[i].VendorCompanyId + '" checked=checked /><span>' + listResults[i].VendorCompanyName + '</span></li>';
                        } else {
                            contractVendorsHtml += '<li><input type="checkbox" value="' + listResults[i].VendorCompanyId + '" /><span>' + listResults[i].VendorCompanyName + '</span></li>';
                        }
                    }
                    $(targetSelect).empty().html(contractVendorsHtml);
                }
            });
        }
    });
}

function getNewBuyers(targetSelect) {
    var contractBuyersHtml = ''; dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/GetBuyers', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                contractBuyersHtml += '<li><input type="checkbox" value="' + results[i].LocationId + '" checked /><span>' + results[i].LocationName + ' (' + results[i].CompanyName + ')</span></li>';
            }
            $(targetSelect).empty().html(contractBuyersHtml);
        }
    });
}

function getBuyers(targetSelect, contractID) {
    var contractBuyersHtml = ''; dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/GetBuyers', {
        type: 'POST',
        data: data,
        success: function (msg) {
            listResults = msg['ReturnData'];
            dto = { "Key": _key, "ContractId": contractID }, data = JSON.stringify(dto);
            $.ajax('../api/Contract/ContractBuyers', {
                type: 'POST',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg['ReturnData'];
                    for (var i = 0; i < listResults.length; i++) {
                        if ($.inArray(parseInt(listResults[i].LocationId), results) > -1) {
                            contractBuyersHtml += '<li><input type="checkbox" value="' + listResults[i].LocationId + '" checked=checked /><span>' + listResults[i].LocationName + ' (' + listResults[i].CompanyName + ')</span></li>';
                        } else {
                            contractBuyersHtml += '<li><input type="checkbox" value="' + listResults[i].LocationId + '" /><span>' + listResults[i].LocationName + ' (' + listResults[i].CompanyName + ')</span></li>';
                        }
                    }
                    $(targetSelect).empty().html(contractBuyersHtml);
                }
            });
        }
    });
}

function getContractStatuses(contractStatus, targetSelect) {
    var contractStatusHtml = '<option value="0">Select Status</option>', dto = { "Key": _key }, data = JSON.stringify(dto);
    $.ajax('../api/Utilities/GetStatuses', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                if (contractStatus == results[i].StatusNameName) {
                    contractStatusHtml += '<option value="' + results[i].StatusId + '" selected>' + results[i].StatusNameName + '</option>';
                } else {
                    contractStatusHtml += '<option value="' + results[i].StatusId + '">' + results[i].StatusNameName + '</option>';
                }
            }
            $(targetSelect).empty().html(contractStatusHtml);
        }
    });
}

$('#logout').unbind().click(function (e) {
    e.preventDefault();
    logoutControls();
});

var u = localStorage['MHBGuser'], p = localStorage['MHBGpass'];
$.when(refreshKey(u, p)).then(function () {
    //logoutControls();
    //userNameFill();
});

function disableOnContractStatus(classes) {
    var currentStatus = $('#contractDetails').attr('class').replace('admin', '').trim(), currentStatusID;
    if ($('#editActiveContract').is(':visible')) currentStatus = $('#editActiveContract').attr('class').replace('admin', '').trim();
    switch (currentStatus) {
        case "new": currentStatusID = 1; break;
        case "open": currentStatusID = 2; break;
        case "outtobid": currentStatusID = 3; break;
        case "closed": currentStatusID = 4; break;
    }
    if (check(classes, currentStatusID)){
        $('#contractDetails').find('input').not(':submit, :button').prop('disabled', true);
        $('#contractDetails select').prop('disabled', true);
        $('.optout, .default').removeProp('href').removeClass().addClass('disabled').click(false);
        $('#editActiveContract').find('input').not(':submit, :button').prop('disabled', true);
        $('#editActiveContract select').prop('disabled', true);
    }

    function check(arr, obj) {
        return (arr.indexOf(obj) != -1);
    }
}

/****** VENDOR VIEW *******/
function loadLanguageScreen() {
    $('#languages').empty();
    var dto = { "All": "all" }, data = JSON.stringify(dto);
    $.ajax('../api/Language/Languages', {
        type: 'POST',
        data: data,
        success: function (msg) {
            results = msg['ReturnData'];
            console.log(results);
        },
        error: function (msg) {
            alert("Server error - please try again");
        }
    });
}

function loadEnglishScreen() {
    $('#englishTerms').empty();
    var dto = { "All": "all" }, data = JSON.stringify(dto);
    $.ajax('../api/EnglishTerm/EnglishTerms', {
        type: 'POST',
        data: data,
        success: function (msg) {
            results = msg['ReturnData'];
            console.log(results);
        },
        error: function (msg) {
            alert("Server error - please try again");
        }
    });
}

function loadTranslationScreen() {
    $('#translations').empty();
    var dto = { "All": "all" }, data = JSON.stringify(dto);
    $.ajax('../api/TranslatedTerm/TranslatedTerms', {
        type: 'POST',
        data: data,
        success: function (msg) {
            results = msg['ReturnData'];
            console.log(results);
        },
        error: function (msg) {
            alert("Server error - please try again");
        }
    });
}

function zoneMaint() {
    getZoneLocations();
    $('#zoneName').val();

    $('.sendForm').unbind().click(function (e) {
        e.preventDefault();
        if ($('#zoneName').val() == "") {
            alert("The Zone Name can not be empty");
        } else {
            var newZone = $('#zoneName').val();
            var dto = { "Key": _key, "VendorZoneID": -1, "ZoneName": newZone }, data = JSON.stringify(dto);
            $.ajax('../api/Contract/UpdateVendorZone', {
                type: 'PUT',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg;
                    $.when($('.admin').fadeOut('20')).then(function () {
                        $('#zoneMaintenance').fadeIn('20');
                        zoneMaint();
                    });
                },
                error: function (msg) {
                    results = msg;
                    alert("The zone name was not added. Please contact Stimulant Group if this continues to occur.")
                }
            });
        }
    });
}

function loadVendorView(contractStatus, contractID, contractName) {
    var vendorHtml = '', vendorTableHead, results;
    $('#contractDetails').attr('class', 'admin ' + contractStatus).fadeIn('20');

    $('.finished').unbind().click(function (e) {
        e.preventDefault();
        openModal("#confirmTermsModal");

        $('#confirmTerms').unbind().click(function (e) {
            e.preventDefault();

            if (!($('#confirmTermsBox').is(':checked'))) {
                alert("You must agree to the terms and conditions before continuing.");
            } else {
                var terms = $('#contractNote').val();
               
                var dto = { "Key": _key, "ContractId": contractID, "Terms": terms }, data = JSON.stringify(dto);
                $.ajax('../api/Contract/VendorSubmit', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        startTimer(msg['Key']);
                        results = msg['ReturnData'];
                        closeModal();
                        $('.admin').hide();
                        getContractList();
                    },
                    error: function (msg) {
                        alert("Server error - please try again");
                    }
                });
            }
        });

        $('#cancelTerms').unbind().click(function (e) {
            e.preventDefault();
            closeModal();
        });
    });


    var vendorHtml = '<thead><th class="print-me">SKU / Zone</th>', results, dto, data;
    showProgress('body');
    dto = { "Key": _key, "ContractID": contractID }, data = JSON.stringify(dto);
    $.ajax('../api/Contract/VendorContractZonePricing', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData5'];
            var terms = msg['ReturnData'];
            var zones = new Array();
            //Count and grab zones
            for (var i = 0; i < results[0].Location.Prices.length; i++) {
                vendorHtml += '<th>' + results[0].Location.Prices[i].VendorZoneName + '<a class="print-zone" href="#">Print Zone</a></th>';
            }
            vendorHtml += '</thead><tbody>';
            for (var i = 0; i < results.length; i++) {
                vendorHtml += '<tr><td class="print-me">' + results[i].Location.SKUName + '</td>';
                var SKUID = results[i].Location.RCGSkuid;
                for (var j = 0; j < results[i].Location.Prices.length; j++) {
                    vendorHtml += '<td class="zone-entry">Zone qty: ' + results[i].Location.Prices[j].ZoneQty +' <input type="text" value="' + results[i].Location.Prices[j].Price + '" data-vendorzoneid="' + results[i].Location.Prices[j].VendorZoneID + '" data-skuid="' + SKUID + '" placeholder="Price"></td>';
                }
                vendorHtml += '</tr>';
            }
            vendorHtml += '</tbody>';
            
            $('#vendorsTable').empty().html(vendorHtml);
            bindVendorControls(contractID);
           // $('.zone-entry').autoNumeric('init');
            $('#contractNote').val(terms[0].Terms);
            hideProgress();
        }
    });
}

function bindVendorControls(contractID) {
    $('.print-zone').unbind().click(function (e) {
        e.preventDefault();
        var n = $(this).parent().index();
        n++;
        $('.contract-note').text($('#contractNote').val());
        $.when($.when($('#vendorsTable td:nth-child(' + n + '), #vendorsTable th:nth-child(' + n + ')').addClass('print-me2')).then(function () {
            window.print();
        })).then(function () { $('.print-me2').removeClass('print-me2'); $('contrct-note').text(''); })
        
    });
    var currentValue;
    $('input[type=text]').unbind().blur(function () {
        currentBox = $(this);
        //currentBox.parent().next().html(currentBox.val() * 12);
        if ($(this).val() == currentValue) {
            $(currentBox).css('border-color', 'yellow').removeProp('placeholder');
        } else if ($(this).val() == "") {
            $(currentBox).val(currentValue).removeProp('placeholder');
        } else {
            dto = { "Key": _key, "Price": $(this).val(), "VendorZoneId": $(this).data('vendorzoneid'), "SkuId": $(this).data('skuid'), "ContractId": contractID }, data = JSON.stringify(dto);
            console.log(dto);
            $.ajax('../api/Contract/UpdateVCBSKUPrice', {
                type: 'PUT',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg;
                    $(currentBox).css('border-color', 'green').removeProp('placeholder');
                },
                error: function (msg) {
                    results = msg;
                    $(currentBox).css('border-color', 'red').removeProp('placeholder');
                }
            });
        }
    });

    $('input[type=text]').focus(function () {
        currentValue = $(this).val();
        //$(this).val('');
        $(this).attr('placeholder', currentValue);
        /*$('input').keyup(function (e) {
            var regex = /^\d[,]+(\.\d{0,2})?$/g;
            if (this.value != '') {
                if (!regex.test(this.value)) {
                    alert('Value must be valid numeric amount');
                    $(this).val(currentValue);
                } else {
                    this.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
                }
            }
        });*/


        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 500);
    });
    
    // "Parent" checkbox controller
    $('.masterCheck').change(function () {
        var currentValue, currentCheckbox = $(this), locationID = $(this).val(), SKUID = $(this).val(); checkState = $(this).is(':checked') ? true : false, apiName = checkedView == "byLocation" ? '../api/Contract/VendorOptOutLocation' : '../api/Contract/VendorOptOutSKU', currentChecked = $(this).is(':checked') ? true : false;
        showProgress('body');
        dto = checkedView == "byLocation" ? { "Key": _key, "ContractId": contractID, "LocationID": locationID, "OptOut": currentChecked } : { "Key": _key, "ContractId": contractID, "SKUId": SKUID, "OptOut": currentChecked }, data = JSON.stringify(dto);
        $.ajax(apiName, {
            type: 'PUT',
            data: data,
            success: function (msg) {
                startTimer(msg['Key']);
                hideProgress();
                if ($(currentCheckbox).is(':checked')) { $(currentCheckbox).parent().parent().css('background-color', 'yellow'); } else { $(currentCheckbox).parent().parent().removeAttr('style'); }
            }
        });

        $(this).parents('tr').next('tr').find('input[type=checkbox]').each(function () {
            if (checkState) { $(this).prop('checked', true); } else { $(this).prop('checked', false); }
            if ($(this).is(':checked')) { $(this).parent().parent().css('background-color', 'yellow'); } else { $(this).parent().parent().removeAttr('style'); }
        });
    });

    // Price controls for Vendor > SKU view
    $('input.decimal-entry').focus(function () {
        currentValue = $(this).val();
        //$(this).val('');
        $(this).attr('placeholder', currentValue);
        /*$('input').keyup(function (e) {
            var regex = /^\d+(\.\d{0,2})?$/g;
            if (this.value != '') {
                if (!regex.test(this.value)) {
                    alert('Value must be valid numeric amount');
                    $(this).val(currentValue);
                }
            }
        });*/
    });

    //$('input:text').blur(function () {
    //    currentBox = $(this);
    //    if ($(this).val() == currentValue) {
    //        $(currentBox).css('border-color', 'yellow').removeProp('placeholder').autoNumeric('init');
    //    } else if ($(this).val() == "") {
    //        $(currentBox).val(currentValue).removeProp('placeholder').autoNumeric('init');
    //    } else {
    //        dto = { "Key": _key, "ContractId": contractID, "Price": $(this).val(), "SKUId": $(this).data('skuid') }, data = JSON.stringify(dto);
    //        $.ajax('../api/Contract/UpdateVCBSKUPrice', {
    //            type: 'PUT',
    //            data: data,
    //            success: function (msg) {
    //                startTimer(msg['Key']);
    //                results = msg;
    //                $(currentBox).css('border-color', 'green').removeProp('placeholder').autoNumeric('init');
    //            },
    //            error: function (msg) {
    //                results = msg;
    //                $(currentBox).css('border-color', 'red').removeProp('placeholder').autoNumeric('init');
    //            }
    //        });
    //    }
    //});

    $('.decimal-entry').autoNumeric('init', { mDec: '5' });

    disableOnContractStatus([4]);
}

/****** BUYER VIEW *******/
function loadBuyerScreen() {
    $('#home').empty().load('partials/buyer-table.html', function () {
        $('.admin').hide();
        $('#contractList').fadeIn('20');

        $('nav.adminnav a').unbind().click(function (e) {
            e.preventDefault();
            var checkedView = $(this).parent().attr('id');
            $.when($('.admin').fadeOut('20')).then(function () {
                editDefaultQuantities();
            });
        });

        $('.finished').unbind().click(function (e) {
            e.preventDefault();
            $('.admin').hide();
            alert("Your quantities have been submitted.");
            getContractList();
        });
    });
}

function editDefaultQuantities() {
    $('#locationSKUDefaults tbody').empty();
    $('#defaultQuantities').fadeIn('20');
    getAllBuyerLocations('#allBuyerLocations');
    getContractTypes('#allContractTypes');
    $('#getDefaultQuantities').unbind().click(function (e) {
        e.preventDefault();
        showProgress('body');
        var buyerLocationsHtml = '', dto = { "Key": _key, "ContractType": $('#allContractTypes option:selected').val(), "LocationID": $('#allBuyerLocations option:selected').val() }, data = JSON.stringify(dto);
        $.ajax('../api/Utilities/GetBuyerDefaults', { // SKUName, Quantity, YearlyUsageId
            type: 'POST',
            data: data,
            success: function (msg) {
                startTimer(msg['Key']);
                results = msg['ReturnData'];
                for (var i = 0; i < results.length; i++) {
                    var quantity = results[i].Quantity;
                    buyerLocationsHtml += '<tr><td>' + results[i].SKUName + '</td><td><input type="text" class="decimal-entry" value="' + parseInt(quantity) / 12 + '" data-yearlyusageid="' + results[i].YearlyUsageId + '" placeholder="" /></td><td class="tablenumbers">' + parseInt(quantity) + '</td></tr>';
                }
                $.when($('#locationSKUDefaults tbody').empty().html(buyerLocationsHtml)).then(function () {
                    $('#locationSKUDefaults input, #locationSKUDefaults td:nth-child(3)').autoNumeric('init', { mDec: 0 });
                    var currentValue;

                    $('input[type=text]').unbind().blur(function () {
                        currentBox = $(this);
                        currentBox.parent().next().html(currentBox.val() * 12);
                        if ($(this).val() == currentValue) {
                            $(currentBox).css('border-color', 'yellow').removeProp('placeholder');
                        } else if ($(this).val() == "") {
                            $(currentBox).val(currentValue).removeProp('placeholder');
                        } else {
                            dto = { "Key": _key, "YearlyUsageId": $(this).data('yearlyusageid'), "YearlyUsage": ($(this).val() * 12) }, data = JSON.stringify(dto);
                            $.ajax('../api/Utilities/UpdateDefaultQuantity', {
                                type: 'PUT',
                                data: data,
                                success: function (msg) {
                                    startTimer(msg['Key']);
                                    results = msg;
                                    $(currentBox).css('border-color', 'green').removeProp('placeholder').autoNumeric('init');
                                },
                                error: function (msg) {
                                    results = msg;
                                    $(currentBox).css('border-color', 'red').removeProp('placeholder').autoNumeric('init');
                                }
                            });
                        }
                    });

                    $('input[type=text]').focus(function () {
                        currentValue = $(this).val();
                        //$(this).val('');
                        $(this).attr('placeholder', currentValue);
                        /*$('input').keyup(function (e) {
                            var regex = /^\d[,]+(\.\d{0,2})?$/g;
                            if (this.value != '') {
                                if (!regex.test(this.value)) {
                                    alert('Value must be valid numeric amount');
                                    $(this).val(currentValue);
                                } else {
                                    this.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
                                }
                            }
                        });*/


                        $('html, body').animate({
                            scrollTop: $(this).offset().top
                        }, 500);
                    });

                    $('.decimal-entry').autoNumeric('init');

                    disableOnContractStatus([3, 4]);
                    hideProgress();
                });
            }
        });
    });
}

function viewBuyerContractPrices(contractStatus, contractID) {
    var buyerLocationsHtml, buyerHtml = '', results, dto, data;
    $('#contractDetails').attr('class', 'admin ' + contractStatus).fadeIn('20');

    dto = { "Key": _key, "ContractID": contractID }, data = JSON.stringify(dto);
    $.ajax('../api/Contract/BuyerLocations', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            resultsLocations = msg['ReturnData'];
            for (var i = 0; i < resultsLocations.length; i++) {
                buyerLocationsHtml += '<tr id="Location' + resultsLocations[i].LocationId + '"><td><i class="fa fa-filter"></i><a href="#" class="collapsed" data-locationid="' + resultsLocations[i].LocationId + '">' + resultsLocations[i].LocationName + '</a></td><td class="tablecenter"><i class="fa fa-ban"></i><a href="#" class="optout" data-locationid="' + resultsLocations[i].LocationId + '">Opt Out (All SKUs)</a><i class="fa fa-retweet"></i><a href="#" class="default" data-locationid="' + resultsLocations[i].LocationId + '">Reset Quantities to Default</a></td></tr><tr style="display: none;"><td colspan="2"></td></tr>';
            }

            $('#buyerSKUsQuantity tbody').empty().html(buyerLocationsHtml);

            $('#buyerSKUsQuantity tbody td:first-child a').unbind().click(function (e) {
                e.preventDefault();
                currentLink = $(this), nextRow = $(this).parent().parent().next();
                if ($(currentLink).hasClass('collapsed')) {
                    $(currentLink).removeAttr('class').addClass('visible');

                    locationID = $(currentLink).data('locationid');

                    if ($('.active-row').length < 1) {
                        var newCell = $(nextRow).find('td');
                        $(nextRow).slideDown('150').addClass('active-row');
                        getBuyerSKUByLocation(locationID, newCell, contractID);
                    } else {
                        $('.active-row').removeAttr('class').slideUp('150', function () {
                            var newCell = $(nextRow).find('td');
                            $(nextRow).slideDown('150').addClass('active-row');
                            getBuyerSKUByLocation(locationID, newCell, contractID);
                        });
                    }
                } else {
                    $(nextRow).slideUp('50', function () { $(nextRow).find('td').empty(); });
                    $(currentLink).removeAttr('class').addClass('collapsed');
                }
            });

            $('.optout').unbind().click(function (e) {
                e.preventDefault();
                var activeRow = $(this).parents('tr').next('tr');
                showProgress('body');
                locationID = $(this).data('locationid');
                dto = { "Key": _key, "ContractID": contractID, "LocationID": locationID }, data = JSON.stringify(dto);
                $.ajax('../api/Contract/BuyerContractOptOut', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        startTimer(msg['Key']);
                        if ($(activeRow).hasClass('active-row')) {
                            var activeCell = $(activeRow).find('td');
                            getBuyerSKUByLocation(locationID, activeCell, contractID);
                        } else {
                            hideProgress();
                        }
                    }
                });                    
            });

            $('.default').unbind().click(function (e) {
                e.preventDefault();
                var activeRow = $(this).parents('tr').next('tr');
                showProgress('body');
                locationID = $(this).data('locationid');
                dto = { "Key": _key, "ContractID": contractID, "LocationID": locationID }, data = JSON.stringify(dto);
                $.ajax('../api/Contract/BuyerRestoreDefaults', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        startTimer(msg['Key']);
                        if ($(activeRow).hasClass('active-row')) {
                            var activeCell = $(activeRow).find('td');
                            getBuyerSKUByLocation(locationID, activeCell, contractID);
                        } else {
                            hideProgress();
                        }
                    }
                });
            });

            disableOnContractStatus([3, 4]);
        }
    });
}

function getBuyerSKUByLocation(locationID, newCell, contractID) {
    var buyerHtml = '<table><thead><tr><th>SKU</th><th>Product Description</th><th>Qty</th></tr></thead><tbody>';
    if($('#progressBar').length < 1) showProgress('body');
    dto = { "Key": _key, "LocationId": locationID, "ContractId": contractID }, data = JSON.stringify(dto);
    $.ajax('../api/Contract/BuyerContractSKUsByLocationID', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            results = msg['ReturnData'];
            for (var i = 0; i < results.length; i++) {
                buyerHtml += '<tr><td>' + results[i].ContractBuyerSKUId + '</td><td>' + results[i].SKUName + '</td><td class="tablecenter"><input class="decimal-entry" name="' + results[i].ContractBuyerSKUId + '" type="text" value="' + results[i].Quantity + '" /></td></tr>';
            }
            buyerHtml += '</tbody></table>';
            $(newCell).empty().html(buyerHtml);
            bindBuyerControls();
            hideProgress();
        }
    });
}

function bindBuyerControls() {
    var currentValue;

    $('input.decimal-entry').unbind().focus(function () {
        currentValue = $(this).val();
        //$(this).val('');
        $(this).attr('placeholder', currentValue);
        /*$('input').keyup(function (e) {
            var regex = /^\d+(\.\d{0,2})?$/g;
            if (this.value != '') {
                if (!regex.test(this.value)) {
                    alert('Value must be valid numeric amount');
                    $(this).val(currentValue);
                }
            }
        });*/
    });
    $('input.decimal-entry').unbind().blur(function () {
        currentBox = $(this);

        if ($(this).val() == currentValue) {
            $(currentBox).css('border-color', 'yellow').removeProp('placeholder');
        } else if ($(this).val() == "") {
            $(currentBox).val(currentValue).removeProp('placeholder');
        } else {
            dto = { "Key": _key, "ContractBuyerSKUId": $(this).attr('name'), "Quantity": $(this).val() }, data = JSON.stringify(dto);
            $.ajax('../api/Contract/UpdateCBSKUQuantity', {
                type: 'PUT',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg;
                    $(currentBox).css('border-color', 'green').removeProp('placeholder').autoNumeric('init');
                },
                error: function (msg) {
                    results = msg;
                    $(currentBox).css('border-color', 'red').removeProp('placeholder').autoNumeric('init');
                }
            });
        }
    });
    $('.decimal-entry').autoNumeric('init');

    disableOnContractStatus([3, 4]);
}

/****** ADMIN VIEW *******/
function loadAdminScreen() {
    $('#home').empty().load('partials/admin-forms.html', function () {
        $('.admin').hide();
        $('#contractList').fadeIn('20');

        $('nav.adminnav a').unbind().click(function (e) {
            e.preventDefault();
            var navElement = $(this).attr('class') + '-' + $(this).parent().attr('id');
            $.when($('.admin').fadeOut('20')).then(function () {
                switch (navElement) {
                    case "add-user": $('#userSearch ul').empty(); $('#skuForm, #addNewContract, #locationForm, #userForm').removeClass('add').removeClass('edit');
                        $('#userForm').addClass('add').fadeIn('20'); addEditUser(); break;
                    case "add-sku": $('#skuForm, #addNewContract, #locationForm, #userForm').removeClass('add').removeClass('edit');
                        $('#skuForm').addClass('add').fadeIn('20'); addEditSKU(); break;
                    case "add-contract": $('#addNewContract').fadeIn('20'); createContract(); break;
                    case "add-location": $('#skuForm, #addNewContract, #locationForm, #userForm').removeClass('add').removeClass('edit').removeClass('quantity');
                        $('#locationForm').addClass('add').fadeIn('20'); addEditLocation(); break;
                    case "edit-user": $('#userSearch ul').empty(); $('#skuForm, #addNewContract, #locationForm, #userForm').removeClass('add').removeClass('edit');
                        $('#userForm').addClass('edit').fadeIn('20'); addEditUser(); break;
                    case "edit-sku": $('#skuForm, #addNewContract, #locationForm, #userForm').removeClass('add').removeClass('edit');
                        $('#skuForm').addClass('edit').fadeIn('20'); addEditSKU(); break;
                    case "edit-contract": getContractList(); break;
                    case "edit-location": $('#skuForm, #addNewContract, #locationForm, #userForm').removeClass('add').removeClass('edit').removeClass('quantity');
                        $('#locationForm').addClass('edit').fadeIn('20'); addEditLocation(); break;
                    case "quantity-location": $('#skuForm, #addNewContract, #locationForm, #userForm').removeClass('add').removeClass('edit').removeClass('quantity');
                        $('#locationForm').addClass('quantity').fadeIn('20'); editDefaultQuantitiesVendor(); break;
                    case "view-report": $('#adminReport').fadeIn('20'); viewAdminReport(); break;
                }
            });
        });

        $('.finished').unbind().click(function (e) {
            e.preventDefault();
            $('.admin').hide();
            getContractList();
        });
    });
}
function viewContractCharts(contractID, locationID) {
    var dto = { "Key": _key, "ContractId": contractID, "LocationId": locationID };
    data = JSON.stringify(dto);
    showProgress('body');

    $.ajax('../api/Contract/ContractCharts', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            hideProgress();
            var chart1name = msg.ReturnData4[0].text[0];
            var chart1series = msg.ReturnData4[0].series;
            var chart2series = msg.ReturnData4[1].series;
            var chart3series = msg.ReturnData4[2].series;
            var chart4series = msg.ReturnData4[3].series;
           
                ////Chart 1
                $('#chart1').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'MHBG Low Bid Report'
                    },
                    subtitle: {
                        text: chart1name
                    },
                    xAxis: {
                        categories: [
                            'Vendors'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Bid Amount ($)'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b> ${point.y:.2f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: chart1series
                });
            
            /////Chart 2
                $('#chart2').highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'MHBG Aggregate Bid Price Change %'
                    },
                    subtitle: {
                        text: 'Not weighted for changes in usages'
                    },
                   
                    yAxis: {
                        min: -25,
                        title: {
                            text: '% Change from Previous Bid',
                            align: 'middle'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' percentage change'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 100,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: chart2series
                });
            
            ///Chart 3
                $('#chart3').highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'MHBG Aggregate Bid Price Change $'
                    },
                    subtitle: {
                        text: 'Not weighted for usage fluctuations'
                    },
                    
                    yAxis: {
                        min: -100000,
                        title: {
                            text: '$ Change from Previous Bid',
                            align: 'middle'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' $ change'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: 100,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: chart3series
                });
            
            ////Chart 4
                $('#chart4').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Top SKU Bid Price Comparison'
                    },
                    subtitle: {
                        text: 'By Vendor'
                    },
                    xAxis: {
                        categories: [
                            '14/2 1000',
                            '12/2 1000',
                            '14/3 1000',
                            '8/3 500'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Price'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>${point.y:.4f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: chart4series
                });
            
        }
    });
    $("#location3DDL").unbind().change(function () {       
        viewContractCharts(contractID, $(this).val());
        hideProgress();
    });
}
function viewComparisonReport(contractID, locationID) {      
    var dto = { "Key": _key, "ContractId": contractID, "LocationId": locationID };
    data = JSON.stringify(dto);
    showProgress('body');
    
    $.ajax('../api/Contract/ContractComparisonReport', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            hideProgress();
            var APIresults = msg.ReturnData[0].reporttable;
            $.when($('#tblComparison').empty().append(APIresults)).then(function () {
                do_sums();
            });
        }
    });
    $("#location2DDL").unbind().change(function () {
     
        viewComparisonReport(contractID, $(this).val());
    });
}
function sumOfColumns(table, columnIndex) {
    var tot = 0;
    table.find("tr").children("td:nth-child(" + columnIndex + ")")
    .each(function () {
        $this = $(this);
        if (!$this.hasClass("comptotal") && $this.html() != "") {
            tot += parseFloat($this.html().replace('<span style="float:left;">$</span>', "").replace('<span style="float: left;">$</span>', "").replace("$", "").replace(" %", "").replace(",", ""));
        }


    });
    return tot;
}

function do_sums() {
    $("tr.totalrow").each(function (i, tr) {
        $tr = $(tr);
        $tr.children().each(function (i, td) {
            $td = $(td);
            
            var table = $td.parent().parent().parent();
            if ($td.hasClass("comptotal")) {
                $td.html(sumOfColumns(table, i + 1)).autoNumeric('init', { aSep: ',', mDec: '0' });
            }
            if ($td.hasClass("comptotaldollars")) {
                
                $td.html(sumOfColumns(table, i + 1)).autoNumeric('init', { aSign: '$' });
                
            }
            if ($td.hasClass("comppercent")) {
                var prevtotal = parseFloat($('.prevtotal').html().replace('<span style="float:left;">$</span>', "").replace('<span style="float: left;">$</span>', "").replace("$", "").replace(" %", "").replace(",", ""));

                $td.html((((parseFloat($td.prev().html().replace('<span style="float:left;">$</span>', "").replace('<span style="float: left;">$</span>', "").replace("$", "").replace(" %", "").replace(",", "")) - prevtotal) / prevtotal) * 100).toFixed(2) + " %");
                if ($td.html() == '-100.00 %')
                { $td.html('0.00 %');}
            }
        })
    });
}
function viewAdminReport() {
    var dto = { "Key": _key };
    data = JSON.stringify(dto);
    showProgress('body');
    getBuyerCompanies('#companyDDL');
    getLocationsDDL('#locationDDL');
    $.ajax('../api/Contract/DefaultUsageReport', {
        type: 'POST',
        data: data,
        success: function (msg) {
            startTimer(msg['Key']);
            hideProgress();
            var APIresults = msg.ReturnData[0].reporttable;
            $.when($('#skuReport').empty().append(APIresults)).then(function () {
                totalTable();

                var $t = $('#skuReport'), $w = $(window), $thead = $(this).find('thead').clone(), $col = $(this).find('thead, tbody').clone();
                $t.addClass('sticky-enabled').css({ margin: 0, width: '100%' });

                // Check if table is set to overflow in the y-axis
                if ($t.hasClass('overflow-y')) $t.removeClass('overflow-y').parent().addClass('overflow-y');

                // Create new sticky table head (basic)
                $t.after('<table class="sticky-thead" />')

                // If <tbody> contains <th>, then we create sticky column and intersect (advanced)
                if ($t.find('tbody th').length > 0) {
                    $t.after('<table class="sticky-col" /><table class="sticky-intersect" />');
                }
                // Create shorthand for things
                var $stickyHead = $(this).siblings('.sticky-thead'), $stickyCol = $(this).siblings('.sticky-col'), $stickyInsct = $(this).siblings('.sticky-intersect'), $stickyWrap = $(this).parent('.sticky-wrap');

                // Sticky header gets all content from <thead>
                $stickyHead.append($thead);

                // Sticky column gets content from the first <th> of both <thead> and <tbody>
                $stickyCol.append($col).find('thead th:gt(0)').remove().end().find('tbody td').remove();

                // Sticky intersect gets content from the first <th> in <thead>
                $stickyInsct.html('<thead><tr><th>' + $t.find('thead th:first-child').html() + '</th></tr></thead>').find('th').css('height', $t.find('thead').innerHeight());

                // Function 1: setWidths()
                // Purpose: To set width of individually cloned element
                var setWidths = function () {
                    $t.find('thead th').each(function (i) {
                        $stickyHead.find('th').eq(i).width($(this).width());
                    }).end().find('tr').each(function (i) {
                        $stickyCol.find('tr').eq(i).height($(this).height());
                    });

                    // Set width of sticky table head
                    $stickyHead.width($t.width());

                    // Set width of sticky table col
                    $stickyCol.find('th').add($stickyInsct.find('th')).width($t.find('thead th').width())

                },
                // Function 2: repositionStickyHead()
                // Purpose: To position the cloned sticky header (always present) appropriately
                repositionStickyHead = function () {
                    // Return value of calculated allowance
                    var allowance = calcAllowance();

                    // Check if wrapper parent is overflowing along the y-axis
                    if ($t.height() > $stickyWrap.height()) {
                        // If it is overflowing
                        // Position sticky header based on wrapper's scrollTop()
                        if ($stickyWrap.scrollTop() > 0) {
                            // When top of wrapping parent is out of view
                            $stickyHead.add($stickyInsct).css({
                                opacity: 1,
                                top: $stickyWrap.scrollTop()
                            });
                        } else {
                            // When top of wrapping parent is in view
                            $stickyHead.add($stickyInsct).css({
                                opacity: 0,
                                top: 0
                            });
                        }
                    } else {
                        // If it is not overflowing (basic layout)
                        // Position sticky header based on viewport scrollTop()
                        if ($w.scrollTop() > $t.offset().top && $w.scrollTop() < $t.offset().top + $t.outerHeight() - allowance) {                 // When top of viewport is within the table, and we set an allowance later
                            // Action: Show sticky header and intersect, and set top to the right value
                            $stickyHead.add($sticktInsct).css({
                                opacity: 1,
                                top: $w.scrollTop() - $t.offset().top
                            });
                        } else {
                            // When top of viewport is above or below table
                            // Action: Hide sticky header and intersect
                            $sticky.add($stickInsct).css({
                                opacity: 0,
                                top: 0
                            });
                        }
                    }
                },
                // Function 3: repositionStickyCol()
                // Purpose: To position the cloned sticky column (if present) appropriately
                repositionStickyCol = function () {
                    if ($stickyWrap.scrollLeft() > 0) {
                        // When left of wrapping parent is out of view
                        // Show sticky column and intersect
                        $stickyCol.add($stickyInsct).css({
                            opacity: 1,
                            left: $stickyWrap.scrollLeft()
                        });
                    } else {
                        // When left of wrapping parent is in view
                        // Hide sticky column but not the intersect
                        // Reset left position
                        $stickyCol
                        .css({ opacity: 0 })
                        .add($stickyInsct).css({ left: 0 });
                    }
                },
                // Function 4: calcAllowance()
                // Purpose: Return value of calculated allowance
                calcAllowance = function () {
                    var a = 0;

                    // Get sum of height of last three rows
                    $t.find('tbody tr:lt(3)').each(function () {
                        a += $(this).height();
                    });

                    // Set fail safe limit (last three row might be too tall)
                    // Set arbitrary limit at 0.25 of viewport height, or you can use an arbitrary pixel value
                    if (a > $w.height() * 0.25) {
                        a = $w.height() * 0.25;
                    }

                    // Add height of sticky header itself
                    a += $stickyHead.height();

                    return a;
                };

                // #1: When DOM is ready (remember, we have wrapped this entire script in $(function(){...});
                setWidths();

                // #2: Listen to scrolling event on the parent wrapper (will fire if there is an overflow)
                $t.parent('.sticky-wrap').scroll($.throttle(250, function () {
                    repositionStickyHead();
                    repositionStickyCol();
                }));

                // Now we bind events to the $(window) object
                $w
                // #3: When all resources are loaded
                .load(setWidths)
                // #4: When viewport is resized
                // (we debounce this so successive resize event is coalesced into one event)
                .resize($.throttle(250, function () {
                    setWidths();
                    repositionStickyHead();
                    repositionStickyCol();
                })
                // #5: When the window is scrolled
                // (we throttled this so scroll event is not fired too often)
                .scroll($.throttle(250, repositionStickyHead())));
            });
        }
    });
    $('#reportType input').click(function () {
        var reportType = $('#reportType input:checked').val();
        if (reportType == "all") {
            $('#locationDDL').hide();
            $('#companyDDL').hide();
            $('th, td').removeClass('hidden').show();
            totalTable();
        } else if (reportType == "company") {
            $('#locationDDL').hide();
            $('#companyDDL').show();
            $('#companyDDL').change(function () {
                var highlightClass = $(this).val();
                $('th, td').removeClass('hidden').show();
                $('th, td').not('td:first-child, th:first-child, .total, .' + highlightClass).addClass('hidden').hide();
                totalTable();
            });
        } else if (reportType == "location") {
            $('#locationDDL').show();
            $('#companyDDL').hide();
            $('#locationDDL').change(function () {
                var highlightClass = $(this).val();
                $('th, td').removeClass('hidden').show();
                $('th, td').not('td:first-child, th:first-child, .total, .' + highlightClass).addClass('hidden').hide();
                totalTable();
            });
        }
    });
}

function totalTable() {
    $('tbody tr').each(function () {
        var rowTotal = 0;
        $('td', this).not('.hidden, td:first-child, .total').each(function () {
            var cellData = Math.round((forceFloat($(this).text()) * 100) / 100).toFixed(2);
            rowTotal = rowTotal*1 + cellData*1;
        }).addClass('tablenumbers');
        $('.total', this).text(rowTotal).addClass('tablenumbers').autoNumeric('init', { mDec: 0 });
        $('td', this).not('.hidden, td:first-child').autoNumeric('init', { mDec: 0 });
    });
}

function addEditSKU() {
    getContractTypes('#skuTypes');
    bindAdminControls();
    $('.searchbox').hide();

    $('#skuForm input, #skuForm label').not('.alwaysshow').hide();
    $('#SKUName').val('');
    $('#SKUID').val('-1');

    $('.add #skuTypes').unbind().change(function () {
        if ($('option:selected', this).val() > 0) $('#skuForm input, #skuForm label').show();
    });

    $('.edit #skuTypes').unbind().change(function () {
        if ($('option:selected', this).val() > 0) {
            $('.searchbox').show();
            getSKUs($('option:selected', this).val());

            $('#skuForm input, #skuForm label').show();
        }
    });

    $('.sendForm').unbind().click(function (e) {
        e.preventDefault();
        var dto = { "Key": _key };
        dto['ContractType'] = $('#skuTypes option:selected').val();
        $(this).parents('.form').find('input').not(':button, :submit').each(function () {
            dto[$(this).attr('id')] = $(this).val();
        });
        data = JSON.stringify(dto);
        showProgress('body');
        $.ajax('../api/Utilities/AddOrEditSKU', {
            type: 'PUT',
            data: data,
            success: function (msg) {
                startTimer(msg['Key']);
                var msg = '<p id="successMsg">' + $('#SKUName').val() + ' added successfully</p>';
                $.when($('#skuAddEdit .buttons').append(msg)).then(function () { hideProgress(); setTimeout('resetSKUForm()', 1000); });
            }
        });
    });
}

function resetSKUForm() {
    $('#successMsg').fadeOut('100', function () {
        $('#successMsg').remove();
        addEditSKU();
    });
}

function editDefaultQuantitiesVendor() {
    $('.searchbox, .form').hide();
    $('#defaultQuantities').fadeIn('20');
    getAllAdminLocations('#allBuyerLocations');
    getContractTypes('#allContractTypes');
    $('#getDefaultQuantities').unbind().click(function (e) {
        showProgress('body');
        e.preventDefault();
        var buyerLocationsHtml = '', dto = { "Key": _key, "ContractType": $('#allContractTypes option:selected').val(), "LocationID": $('#allBuyerLocations option:selected').val() }, data = JSON.stringify(dto);
        $.ajax('../api/Utilities/GetBuyerDefaults', {
            type: 'POST',
            data: data,
            success: function (msg) {
                hideProgress();
                startTimer(msg['Key']);
                results = msg['ReturnData'];
                for (var i = 0; i < results.length; i++) {
                    var quantity = results[i].Quantity;
                    buyerLocationsHtml += '<tr><td>' + results[i].SKUName + '</td><td><input type="text" class="decimal-entry" value="' + parseInt(quantity) / 12 + '" data-yearlyusageid="' + results[i].YearlyUsageId + '" placeholder="" /></td><td class="tablenumbers">' + parseInt(quantity) + '</td></tr>';
                }
                $.when($('#locationSKUDefaults tbody').empty().html(buyerLocationsHtml)).then(function(){
                    $('#locationSKUDefaults input, #locationSKUDefaults td:nth-child(3)').autoNumeric('init', { mDec: 0 } );
                    var currentValue;

                    $('#locationForm .finished').click(function (e) {
                        e.preventDefault();
                        $('#locationSKUDefaults tbody').empty();
                    });

                    $('input[type=text]').unbind().focus(function () {
                        currentValue = $(this).val();
                        $(this).val('');
                        $(this).attr('placeholder', currentValue);

                        $(this).blur(function(){
                            var regex = /^\d+(\.\d{0,5})?$/g, currentBox = $(this); currentBox.parent().next().html(Number(currentBox.val() * 12).toFixed(2));

                            if ($(this).val() != '') {
                                if ($(this).val() == currentValue) {
                                    $(currentBox).css('border-color', 'yellow').removeProp('placeholder').autoNumeric('init');
                                } else {
                                    if (regex.test($(this).val())) {
                                        dto = { "Key": _key, "YearlyUsageId": $(this).data('yearlyusageid'), "YearlyUsage": ($(this).val() * 12) }, data = JSON.stringify(dto);
                                        $.ajax('../api/Utilities/UpdateDefaultQuantity', {
                                            type: 'PUT',
                                            data: data,
                                            success: function (msg) {
                                                startTimer(msg['Key']);
                                                results = msg;
                                                $(currentBox).css('border-color', 'green').removeProp('placeholder').autoNumeric('init');
                                            },
                                            error: function (msg) {
                                                results = msg;
                                                $(currentBox).css('border-color', 'red').removeProp('placeholder').autoNumeric('init');
                                            }
                                        });
                                    } else {
                                        alert('Value must be valid numeric amount');
                                        $(this).val(currentValue);
                                    } 
                                }
                            } else {
                                $(currentBox).val(currentValue).css('border-color', 'yellow').removeProp('placeholder').autoNumeric('init');
                            }
                        });
                    });
                });
            }
        });
    });
}

function addEditLocation() {
    getBuyerCompaniesAll('#buyerCompanies');
    bindAdminControls();
    $('.form').show();
    $('.searchbox').hide();
    $('#LocationName').val('');
    $('#LocationID').val('-1');
    $('#defaultQuantities').hide();

    if ($('.edit .searchbox').length > 0) { $('.searchbox').show(); getLocations(); }

    $('.sendForm').unbind().click(function (e) {
        e.preventDefault();
        var dto = { "Key": _key };
        dto['mxCompanyID'] = $('#buyerCompanies option:selected').val();
        $(this).parents('.form').find('input').not(':button, :submit').each(function () {
            dto[$(this).attr('id')] = $(this).val();
        });
        data = JSON.stringify(dto);
        showProgress('body');
        $.ajax('../api/Utilities/AddOrEditLocation', {
            type: 'PUT',
            data: data,
            success: function (msg) {
                startTimer(msg['Key']);
                var msg = '<p id="successMsg">' + $('#LocationName').val() + ' added successfully</p>';
                $.when($('#locationAddEdit .buttons').append(msg)).then(function () { hideProgress(); setTimeout('resetLocationForm()', 1000); });
            }
        });
    });
}

function resetLocationForm() {
    $('#successMsg').fadeOut('100', function () {
        $('#successMsg').remove();
        addEditLocation();
    });
}

function addEditUser() {
    getUserRoles('#RoleId', 0);

    $('.searchbox').show();
    $('#userSearchLabel, #userSearchTerm, .fa-search').show();
    $('.add #hidePassword').hide();

    $('#UserName').val('');
    $('#UserId').val('-1');
    $('#mxContactId').val();
    $('#userContactInfo').empty();

    // edit users
    if ($('.edit .searchbox').length > 0) {
        $('#hidePassword').show();
        $('#userSearchLabel, #userSearchTerm, .fa-search').hide();
        getUsers();

        $('#hidePassword').unbind().click(function () {
            $(this).hide();
        });
    }

    // add users
    $('#submitSearch').unbind().click(function (e) {
        e.preventDefault();
        showProgress('#userForm .searchbox');
        var dto = { "Key": _key, "SearchString": $('#userSearchTerm').val() }, data = JSON.stringify(dto);
        $.ajax('../api/Utilities/UserContactLookup', {
            type: 'POST',
            data: data,
            success: function (msg) {
                startTimer(msg['Key']);
                var contactsHtml = '', results = msg['ReturnData'];
                if (results.length < 1) contactsHtml = '<li><em>No results were returned. Reminder: users must belong to a company with at least one location assigned.</em></li>';
                for (var i = 0; i < results.length ; i++) {
                    contactsHtml += '<li><a href="#" data-mxid="' + results[i].mxContactId + '">' + results[i].Contact + '</a></li>';
                }
                $.when($('#userForm .searchbox ul').empty().html(contactsHtml)).then(function () {
                    hideProgress();

                    $('.searchbox a').not('#submitSearch').unbind().click(function (e) {
                        var mxid = $(this).data('mxid'), name = $(this).text();
                        e.preventDefault();
                        $('.searchbox li > i').remove();
                        $(this).parent().prepend('<i class="fa fa-check"></i>');
                        $('#mxContactId').val(mxid);
                        $('#userContactInfo').empty().text(name);
                    });
                });
            }
        });
    });

    $('.sendForm').unbind().click(function (e) {
        e.preventDefault();
        var dto = { "Key": _key, "RoleId": $('#RoleId option:selected').val(), "StatusId": $('#StatusId option:selected').val() };
        $(this).parents('.form').find('input:not(:button, :submit, :checkbox)').each(function () {
            dto[$(this).attr('id')] = $(this).val();
        });
        var locationsArray = [];
        $(this).parents('.form').find('#locationsList :checkbox:checked').each(function () {
            locationsArray.push($(this).val());
        });
        dto['UserLocations'] = locationsArray;
        data = JSON.stringify(dto);
        showProgress('body');
        $.ajax('../api/Utilities/AddOrEditUser', {
            type: 'PUT',
            data: data,
            success: function (msg) {
                startTimer(msg['Key']);
                var msg = '<p id="successMsg">' + $('#UserName').val() + ' added successfully</p>';
                $.when($('#userAddEdit .buttons').append(msg)).then(function () { hideProgress(); setTimeout('resetUserForm()', 1000); });
            }
        });
    });
}

function resetUserForm() {
    $('#userAddEdit .buttons p').fadeOut('100', function () {
        $('#successMsg').remove();
        $('#locationsList').empty();

        addEditUser();
    });
}

function fillContractVendors(contractID, contractStatus, contractName, contractTypeID) {
    showProgress('body');
    $('#editActiveContract').removeClass().addClass('admin').addClass(contractStatus.replace(/\s/g, "").toLowerCase()).fadeIn('20');

    //clear the old stuff
    $('#contractDefaultVendor tbody tr:nth-child(2n) td').empty();
    $('#contractAdminVendors tbody').empty();

    getStatuses(contractStatus);

    $('#contractStatus').unbind().change(function () {
        var confirmText, newStatus = $('option:selected', this).text(), newStatusID = $('option:selected', this).val(), oldStatus = contractStatus;
        switch (contractStatus) {
            case "New": confirmText = "Are you certain? You will no longer be able to add or remove buyers or SKUs on this contract."; break;
            case "Open": confirmText = "Are you certain? Buyers can no longer change quantities for or opt out of SKUs on this contract."; break;
            case "Out To Bid": confirmText = "Are you certain? This will close the contract. This cannot be undone."; break;
        }

        $('#confirmText').append(confirmText);
        openModal("#statusChangeModal");

        /*$('#statusDate').blur(function(){
            if($('#statusDate').val() != "") $('#sendEmail').attr('checked', true);
        });*/

        $('#confirmChange').unbind().click(function(e){
            e.preventDefault();
            var statusDate = $('#statusDate').val(), sendEmail = false;
            if ($('#sendEmail').is(':checked')) {
                sendEmail = true;
                if (!statusDate) {
                    alert("Please enter a valid date to include in the email");
                }
            }
            if (statusDate && !isValidDate(statusDate)) {
                alert("Date must be in a valid format (mm/dd/yyyy)");
            } else {
                var dto = { "Key": _key, "ContractId": contractID, "StatusId": newStatusID, 'SendEmail': sendEmail, 'Date': statusDate }, data = JSON.stringify(dto);
                $.ajax('../api/Contract/ContractChangeStatus', {
                    type: 'PUT',
                    data: data,
                    success: function (msg) {
                        startTimer(msg['Key']);
                        results = msg['ReturnData'];
                        $('#confirmText').empty();
                        $('#editActiveContract').removeClass(oldStatus.replace(/\s/g, "").toLowerCase()).addClass(newStatus.replace(/\s/g, "").toLowerCase());
                        contractStatus = newStatus;
                        $.when(getStatuses(contractStatus)).then(function () { closeModal() });
                    },
                    error: function (msg) {
                        alert("Status Not Updated - please try again");
                    }
                });
            }
        });
        
        $('#cancelChange').unbind().click(function (e) {
            e.preventDefault();
            $('#confirmText').empty();
            $.when(getStatuses(oldStatus)).then(function () { closeModal() });
        });        
    });

    $('#editBuyersLink').unbind().click(function (e) {
        $('#editBuyers ul').empty();
        $.when(
            getBuyers('#editBuyers ul', contractID)
            // add ajax call to get buyers for contract
            ).then(function () {
                openModal('#editBuyers');

                bindAdminControls();

                $('.sendForm').unbind().click(function (e) {
                    e.preventDefault();
                    $('#editBuyers').css('z-index', '1000');
                    var buyersArray = [];
                    $('#editBuyers ul input').each(function () {
                        if($(this).is(':checked')) buyersArray.push($(this).val());
                    });
                    var dto = { "Key": _key, "ContractId": contractID, "ContractLocations": buyersArray }, data = JSON.stringify(dto);
                    showProgress('body');
                    $.ajax('../api/Contract/AddOrEditContractLocations', {
                        type: 'PUT',
                        data: data,
                        success: function (msg) {
                            startTimer(msg['Key']);
                            results = msg['ReturnData'];
                            closeModal();
                            hideProgress();
                            $('#editBuyers').removeAttr('style');
                        },
                        error: function (msg) {
                            alert("Buyers Not Updated - please try again");
                            hideProgress();
                        }
                    });
                });
            });
    });

    $('#editVendorsLink').unbind().click(function (e) {
        $('#editVendors ul').empty();
        $.when(
            getVendors('#editVendors ul', contractID)
            // add ajax call to get vendors for contract
            ).then(function () {
                openModal('#editVendors');

                bindAdminControls();

                $('.sendForm').unbind().click(function (e) {
                    e.preventDefault();
                    $('#editVendors').css('z-index', '1000');
                    var vendorsArray = [];
                    $('#editVendors ul input').each(function () {
                        if ($(this).is(':checked')) vendorsArray.push($(this).val());
                    });
                    var dto = { "Key": _key, "ContractId": contractID, "ContractVendors": vendorsArray }, data = JSON.stringify(dto);
                    showProgress('body');
                    $.ajax('../api/Contract/AddOrEditContractVendors', {
                        type: 'PUT',
                        data: data,
                        success: function (msg) {
                            startTimer(msg['Key']);
                            results = msg['ReturnData'];
                            closeModal();
                            hideProgress();
                            $('#editVendors').removeAttr('style');
                            fillContractVendors(contractID, contractStatus, contractName, contractTypeID);
                        }
                    });
                });
            });
    });

    $('#editSKUsLink').unbind().click(function (e) {
        $('#editSKUs ul').empty();
        $.when(
            getSKUsByType('#editSKUs ul', contractTypeID, contractID)
            // add ajax call to get vendors for contract
            ).then(function () {
                openModal('#editSKUs');

                bindAdminControls();

                $('.sendForm').unbind().click(function (e) {
                    e.preventDefault();
                    $('#editSKUs').css('z-index', '1000');
                    var SKUsArray = [];
                    $('#editSKUs ul input').each(function () {
                        if ($(this).is(':checked')) SKUsArray.push($(this).val());
                    });
                    var dto = { "Key": _key, "ContractId": contractID, "ContractSKUs": SKUsArray }, data = JSON.stringify(dto);
                    showProgress('body');
                    $.ajax('../api/Contract/AddOrEditContractSKUs', {
                        type: 'PUT',
                        data: data,
                        success: function (msg) {
                            startTimer(msg['Key']);
                            results = msg['ReturnData'];
                            closeModal();
                            hideProgress();
                            $('#editSKUs').removeAttr('style');
                        },
                        error: function (msg) {
                            alert("SKUs Not Updated - please try again");
                            hideProgress();
                        }
                    });
                });
            });
    });

    $('.expand-default-vendor').unbind().click(function (e) {
        e.preventDefault();
        var currentLink = $(this), nextRow = $(this).parent().parent().next();
        if ($(currentLink).hasClass('visible')) {
            $(nextRow).slideUp('50', function () { $(nextRow).find('td').empty(); });
            $(currentLink).attr('class', 'collapsed expand-default-vendor');
        } else {
            var vendorID = $(currentLink).data('vendorid'), vendorSKUsTableHtml = '<table id="contractVendorSKUs"><thead><tr><th>SKU Description</th><th>Price</th><th>Quantity</th><th>Total</th><th>Awarded To</th></tr></thead><tbody>', dto = { "Key": _key, "ContractId": contractID, "VendorCompanyId": vendorID }, data = JSON.stringify(dto);
            showProgress('body');
            $('.active-vendor').slideUp('50', function () { $('.active-vendor').removeClass('active-vendor') });
            $.ajax('../api/Contract/ContractVendorSKUs', {
                type: 'POST',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg['ReturnData'];
                    var totalQty = 0, totalTotal = 0;
                    for (var i = 0; i < results.length; i++) {
                        vendorSKUsTableHtml += results[i].AwardedTo == 'False' ? '<tr>' : '<tr class="awarded">';
                        vendorSKUsTableHtml += '<td><i class="fa fa-filter"></i><a href="#" class="expand-default-sku collapsed" data-skuid="' + results[i].ContractBuyerSKUId + '">' + results[i].SKUName + '</a></td><td class="tablecenter">' + results[i].Price + '</td><td class="tablenumbers">' + results[i].Quantity + '</td><td class="tablenumbers">' + results[i].Total + '</td><td>' + results[i].AwardedTo + '</td></tr><tr style="display:none;"><td colspan="5"></td></tr>';
                        totalQty = totalQty.toFixed(2) * 1 + forceFloat(results[i].Quantity);
                        totalTotal = totalTotal.toFixed(2) * 1 + forceFloat(results[i].Total);
                    }
                    vendorSKUsTableHtml += '<tr><td><strong>TOTAL</strong></td><td>&nbsp;</td><td class="tablenumbers">' + totalQty + '</td><td class="tablenumbers">' + totalTotal + '</td></tr>';
                    vendorSKUsTableHtml += '</tbody></table>';
                    $(nextRow).find('td').empty().html(vendorSKUsTableHtml);
                    $('#contractVendorSKUs td:nth-child(3), #contractVendorSKUs td:nth-child(4)').autoNumeric('init');
                    (currentLink).attr('class', 'visible expand-default-vendor');
                    $(nextRow).slideDown('50', function () { $(nextRow).addClass('active-vendor') });

                    // fill SKU location table (tertiary table view)
                    $('.expand-default-sku').unbind().click(function (e) {
                        var currentLink = $(this), nextRow = $(this).parent().parent().next();
                        e.preventDefault();
                        if ($(currentLink).hasClass('visible')) {
                            $(nextRow).slideUp('50', function () { $(nextRow).find('td').empty(); });
                            $(currentLink).attr('class', 'collapsed expand-default-sku');
                        } else {
                            var skuID = $(this).data('skuid'), vendorsSKUsLocationsTableHtml = '<table id="contractVendorSKUsLocations" class="all-visible"><thead><tr><th>Location Name</th><th>Price</th><th>Quantity</th><th>Total</th><th>Awarded To</th></tr></thead><tbody>', dto = { "Key": _key, "ContractId": contractID, "VendorCompanyId": vendorID, "SKUId": skuID }, data = JSON.stringify(dto);
                            showProgress('body');
                            $('.active-sku').slideUp('50', function () { $('.active-sku').removeClass('active-sku') });
                            $.ajax('../api/Contract/VendorLocations', {
                                type: 'POST',
                                data: data,
                                success: function (msg) {
                                    startTimer(msg['Key']);
                                    results = msg['ReturnData'];
                                    for (var i = 0; i < results.length; i++) {
                                        vendorSKUsTableHtml += results[i].AwardedTo == 'False' ? '<tr>' : '<tr class="awarded">';
                                        vendorsSKUsLocationsTableHtml += '<td>' + results[i].LocationName + '</td><td class="tablenumbers">' + results[i].Price + '</td><td class="tablenumbers">' + results[i].Quantity + '</td><td class="tablenumbers">' + results[i].Total + '</td><td class="tablenumbers">' + results[i].AwardedTo + '</td></tr>';
                                    }
                                    vendorsSKUsLocationsTableHtml += "</tbody></table>";
                                    $(currentLink).attr('class', 'visible expand-default-sku');
                                    $(nextRow).find('td').empty().html(vendorsSKUsLocationsTableHtml).parent().slideDown('50', function () { $(nextRow).addClass('active-sku') });
                                    hideProgress();
                                }
                            });
                        }
                    });
                    hideProgress();
                }
            });
        }
    });
    
    if (contractStatus == "Out To Bid" || contractStatus == "Closed") {
        var awardedVendors = [], vendorTableHtml = '', dto = { "Key": _key, "ContractId": contractID }, data = JSON.stringify(dto);
        $.ajax('../api/Contract/ContractVendorAwardsByLocation', { //'../api/Contract/ContractVendors', {
            type: 'POST',
            data: data,
            success: function (msg) {
                startTimer(msg['Key']);

                results = msg['ReturnData3'];

                vendorTableHtml += '<thead><tr><th>&nbsp;</th>';
                for (var j = 0; j < results[0].Location.Costs.length; j++) {
                    vendorTableHtml += '<th>' + results[0].Location.Costs[j].VendorName + '</th>';
                }
                vendorTableHtml += '</tr></thead><tbody>';

                for (var i = 0; i < results.length; i++) {
                    vendorTableHtml += '<tr><td data-locationid="' + results[i].Location.LocationID + '">' + results[i].Location.LocationName + '</td>';
                    for (j = 0; j < results[i].Location.Costs.length; j++) {
                        vendorTableHtml += '<td class="tablecenter">$' + results[i].Location.Costs[j].TotalCost + '&nbsp;&nbsp;<input type="checkbox" class="award-contract" value="' + results[i].Location.Costs[j].VendorID + '"';
                        if (results[i].Location.Costs[j].Awarded == true) {
                            vendorTableHtml += ' checked=checked';
                            awardedVendors.push(results[i].VendorName);
                        }
                        vendorTableHtml += '/></td>';
                    }
                    vendorTableHtml += '" </tr>';
                }
                vendorTableHtml += '</tbody>';
                $('#contractAdminVendors').empty().html(vendorTableHtml);
                hideProgress();

                var winners = "(none)";
                if (awardedVendors.length > 0) {
                    winners = "(" + awardedVendors[0] + ")";
                    if (awardedVendors.length > 1) winners = "(multiple vendors)";
                }
                $('#awardedVendors').empty().text(winners);

                $('.award-contract').unbind().click(function () {
                    var vendorID = $(this).val(), locationID = $(this).parent().parent().find('td:first-child').data('locationid'), dto = { "Key": _key, "ContractId": contractID, "VendorCompanyId": vendorID, "LocationID": locationID }, data = JSON.stringify(dto);
                    
                    $(this).parent().siblings().find('input:checked').each(function() {
                        $(this).attr('checked', false);
                    });

                    $.ajax('../api/Contract/AwardContractLocation', {
                        type: 'PUT',
                        data: data,
                        success: function (msg) {
                            startTimer(msg['Key']);
                            results = msg;
                        },
                        error: function (msg) {
                            results = msg;
                        }
                    });
                });

                disableOnContractStatus([4]);
                hideProgress();
            }
        });
    } else {
        hideProgress();
    }

    disableOnContractStatus([4]);
}

function getStatuses(contractStatus) {
    $.when(getContractStatuses(contractStatus, '#contractStatus')).then(function () {
        switch (contractStatus) {
            //TODO: delete or disable previous statuses - this below doesn't work
            case "New":
                $('#contractStatus option:contains("New")').css('color', 'red');
                break;
            case "Open":
                $('#contractStatus option[value="1"]').remove();
                $('#contractStatus option[value="2"]').remove();
                break;
            case "Out To Bid":
                $('#contractStatus option[value="1"]').remove();
                $('#contractStatus option[value="2"]').remove();
                $('#contractStatus option[value="3"]').remove();
                break;
        }
    });
}

function bindAdminControls() {
    // TODO: fix me
    $('.clearForm').unbind().click(function (e) {
        e.preventDefault();
        $(this).parents('.form').find('input:not(:hidden, :button, :submit)').val('');
    });

    $('.cancel').unbind().click(function (e) {
        e.preventDefault();
        closeModal();
    });

    disableOnContractStatus(['closed']);
}

function createContract() {
    $.when(getContractStatuses('New', '#newContractStatus'), getContractTypes('#newContractType')).then(function(){
        $('.wizard').hide();
        newContractDetails();
    });
}

function newContractDetails() {
    $('#contractDetails').show();
    $('#contractDetails input[type="submit"]').click(function (e) {
        e.preventDefault();
        var newContractID, contractID = $('#contractID').val(), contractName = $('#contractName').val(), contractTypeID = $('#newContractType option:selected').val(), contractStatusID = $('#newContractStatus option:selected').val(), contractStart = $('#contractStart').val(), contractEnd = $('#contractEnd').val();
        var dto = { "Key": _key, "ContractID": "-1", "ContractName": contractName, "StartDate": contractStart, "EndDate": contractEnd, "StatusID": contractStatusID, "ContractType": contractTypeID }, data = JSON.stringify(dto);
        showProgress('body');
        $.ajax('../api/Contract/ContractAddOrEdit', {
            type: 'PUT',
            data: data,
            success: function (msg) {
                startTimer(msg['Key']);
                newContractID = msg['ContractId'];
                $('#contractDetails').fadeOut('20', function () { newContractSKUs(newContractID, contractTypeID); });
                hideProgress();
            }
        });
    });
}

function newContractSKUs(newContractID, contractTypeID) {
    $.when(getNewSKUsByType('#contractAddSKUs ul', contractTypeID)).then(function () {
        $('#contractAddSKUs').show();
        $('#contractAddSKUs input[type="submit"]').click(function (e) {
            e.preventDefault();
            var arraySKU = [];
            $('#contractAddSKUs input').each(function () {
                if ($(this).is(':checked')) arraySKU.push($(this).val());
            });
            var dto = { "Key": _key, "ContractId": newContractID, "ContractSKUs": arraySKU }, data = JSON.stringify(dto);
            showProgress('body');
            $.ajax('../api/Contract/AddOrEditContractSKUs', {
                type: 'PUT',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg['ReturnData'];
                    $('#contractAddSKUs').fadeOut('20', function () { newContractBuyers(newContractID, contractTypeID); });
                    hideProgress();
                }
            });
        });
    });
}

function newContractBuyers(newContractID, contractTypeID) {
    $.when(getNewBuyers('#contractAddBuyers ul')).then(function () {
        $('#contractAddBuyers').show();
        $('#contractAddBuyers input[type="submit"]').click(function (e) {
            e.preventDefault();
            var arrayBuyers = [];
            $('#contractAddBuyers input').each(function () {
                if ($(this).is(':checked')) arrayBuyers.push($(this).val());
            });
            var dto = { "Key": _key, "ContractId": newContractID, "ContractLocations": arrayBuyers }, data = JSON.stringify(dto);
            showProgress('body');
            $.ajax('../api/Contract/AddOrEditContractLocations', {
                type: 'PUT',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg['ReturnData'];
                    $('#contractAddBuyers').fadeOut('20', function () {
                        //newContractVendors(newContractID);
                        $('.admin').hide();
                        $('#editActiveContract').fadeIn('20');
                        fillContractVendors(newContractID, "New", "New", contractTypeID);
                    });
                    hideProgress();
                }
            });
        });
    });
}

function newContractVendors(newContractID) {
    $.when(getNewVendors('#contractAddVendors ul')).then(function () {
        $('#contractAddVendors').show();
        $('#contractAddVendors input[type="submit"]').click(function (e) {
            e.preventDefault();
            var arrayVendors = [];
            $('#contractAddBuyers input').each(function () {
                if ($(this).is(':checked')) arrayVendors.push($(this).val());
            });
            var dto = { "Key": _key, "ContractId": newContractID, "ContractVendors": arrayVendors }, data = JSON.stringify(dto);
            showProgress('body');
            $.ajax('../api/Contract/AddOrEditContractVendors', {
                type: 'PUT',
                data: data,
                success: function (msg) {
                    startTimer(msg['Key']);
                    results = msg['ReturnData'];
                    $('#contractAddVendors').fadeOut('20', function () {
                        $('.admin').hide();
                        getContractList();
                    });
                        hideProgress();
                    }
            });
        });
    });
}

// Check for number - unused, for now, since HTML5 input type="number" controls this
$('input[type="number"]').keyup(function (e) {
    if (/\D/g.test(this.value)) {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, '');
    }
});

function forceFloat(string) {
    var converted = parseFloat(string.replace(/[^\d.-]/g, '')).toFixed(2) * 1;
    return converted;
}