(function () {
    'use strict';

    webix.ready(function () {
        webix.ui({
            type: "line",
            cols: [
                {
                    width: 200,
                    rows: [
                        { view: "template", template: "Demo Projects", type: "section" },
                        {
                            view: "list",
                            id: "ProjectList",
                            template: "#name#",
                            select: true, //enables selection 
                            url: "static/json/projects.json"
                        },
                        {
                            cols: [
                                {
                                    view: "button",
                                    type: "icon",
                                    id: "DownloadTarGzBtn",
                                    icon: "download",
                                    label: ".tar.gz"
                                },
                                {
                                    view: "button",
                                    type: "icon",
                                    id: "DownloadZipBtn",
                                    icon: "download",
                                    label: ".zip"
                                }
                            ]
                        },
                        { view: "template", template: "Source Files", type: "section" },
                        {
                            view: "list",
                            id: "FileList",
                            template: "#name#",
                            select: true, //enables selection 
                            url: ""
                        }
                    ]
                },
                {view: "resizer"},
                {
                    rows: [
                        { view: "template", template: "AS3 Code", type: "section" },
                        {
                            view: "scrollview",
                            id: "CodeScrollView",
                            scroll: "xy",
                            body: {
                                template: "<pre><code>#code#</code></pre>",
                                id: "AS3Shell",
                                data: {code: ""},
                                autoheight: true
                            }
                        }
                    ]
                },
                {view: "resizer"},
                {
                    rows: [
                        {view: "template", template: "SWF File", type: "section" },
                        {
                            view: "toolbar",
                            type: "clean",
                            cols: [
                                { view: "toggle", id: "DeveloperBtn", label: "Developer" },
                                { view: "toggle", id: "ReleaseBtn", label: "Release" }
                            ]
                        },
                        {
                            view: "scrollview",
                            scroll: "xy",
                            body: {
                                id: "SWFShell",
                                template: '<embed width="#width#" height="#height#" src="#link#" type="application/x-shockwave-flash" pluginspage="https://get.adobe.com/flashplayer""></embed>',
                                data: {link: ""}
                            }
                        }
                    ]
                }
            ]
        });
        
        function ProjectList_onAfterSelect(id) {
            $$("FileList").clearAll();
            $$("FileList").load($$("ProjectList").getSelectedItem().files);
            
            $$("SWFShell").setValues({
                link: $$("ProjectList").getSelectedItem().swfrelease,
                    width: $$("ProjectList").getSelectedItem().swfwidth,
                    height: $$("ProjectList").getSelectedItem().swfheight
                });
            $$("SWFShell").config.width = $$("ProjectList").getSelectedItem().swfwidth;
            $$("SWFShell").config.height = $$("ProjectList").getSelectedItem().swfheight;
            $$("SWFShell").resize();
            
            $$("DeveloperBtn").setValue(false);
            $$("ReleaseBtn").setValue(true);
        }
        
        function FileList_onAfterSelect(id) {
            $$("AS3Shell").setValues({code: hljs.highlight('actionscript', $$("FileList").getSelectedItem().content).value});
            var htmlContainer = $$("AS3Shell").getNode();
            
            $$("AS3Shell").config.width = htmlContainer.firstChild.firstChild.firstChild.offsetWidth + 5;
            $$("AS3Shell").resize();
        }
        
        $$("DownloadTarGzBtn").attachEvent("onItemClick", function (id) {
            window.location.assign($$("ProjectList").getSelectedItem().tarball);
        });
        
        $$("DownloadZipBtn").attachEvent("onItemClick", function (id) {
            window.location.assign($$("ProjectList").getSelectedItem().zipball);
        });
        
        $$("DeveloperBtn").attachEvent("onItemClick", function (id) {
            if ($$("DeveloperBtn").data.value) {
                $$("SWFShell").setValues({
                    link: $$("ProjectList").getSelectedItem().swfdev,
                    width: $$("ProjectList").getSelectedItem().swfwidth,
                    height: $$("ProjectList").getSelectedItem().swfheight
                });
                $$("SWFShell").config.width = $$("ProjectList").getSelectedItem().swfwidth + 10;
                $$("SWFShell").config.height = $$("ProjectList").getSelectedItem().swfheight + 10;
                $$("SWFShell").resize();
                
                $$("ReleaseBtn").setValue(false);
            }
        });
        
        $$("ReleaseBtn").attachEvent("onItemClick", function (id) {
            if ($$("ReleaseBtn").data.value) {
                $$("SWFShell").setValues({
                    link: $$("ProjectList").getSelectedItem().swfrelease,
                    width: $$("ProjectList").getSelectedItem().swfwidth,
                    height: $$("ProjectList").getSelectedItem().swfheight
                });
                $$("SWFShell").config.width = $$("ProjectList").getSelectedItem().swfwidth;
                $$("SWFShell").config.height = $$("ProjectList").getSelectedItem().swfheight;
                $$("SWFShell").resize();
                
                $$("DeveloperBtn").setValue(false);
            }
        });
        
        $$("ProjectList").attachEvent("onAfterLoad", function (id) {
            $$("ProjectList").select(1, false);
            ProjectList_onAfterSelect(id);
        });
                                      
        $$("ProjectList").attachEvent("onAfterSelect", ProjectList_onAfterSelect);
        
        $$("FileList").attachEvent("onAfterLoad", function (id) {
            $$("FileList").select(1, false);
            FileList_onAfterSelect(id);
        });

        $$("FileList").attachEvent("onAfterSelect", FileList_onAfterSelect);
        
    });
}());
