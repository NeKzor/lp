(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{147:function(e,t,a){e.exports=a(321)},321:function(e,t,a){"use strict";a.r(t);var r=a(0),n=a.n(r),o=a(28),c=a.n(o),l=a(14),i=a(15),s=a(17),u=a(16),p=a(18),d=a(50),h=a.n(d),m=a(22),f=a(73),b=a.n(f),g=a(137),v=a.n(g),E=a(139),w=a.n(E),y=a(35),k=a.n(y),P=a(44),O=a.n(P),j=a(31),x=a.n(j),S=a(90),C=a.n(S),T=a(138),B=a.n(T),R=a(59),L=a.n(R),N=a(23),D=a.n(N),_=a(51),F=a.n(_),A=a(135),I=a.n(A),q=function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.props,t=e.currentTab,a=e.handleTabChange;return n.a.createElement(n.a.Fragment,null,n.a.createElement(I.a,{value:t,onChange:a,variant:"scrollable",textColor:"inherit",color:"inherit",indicatorColor:"secondary"},n.a.createElement(F.a,{label:"Single Player"}),n.a.createElement(F.a,{label:"Cooperative"}),n.a.createElement(F.a,{label:"Overall"}),n.a.createElement(F.a,{label:"Records"}),n.a.createElement(F.a,{label:"About"})))}}]),t}(n.a.Component),M=function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(s.a)(this,Object(u.a)(t).call(this))).state={open:!1},e.showDrawer=function(t){return function(){e.setState({open:t})}},e.gotoPage=function(t){return function(){window.open(e.homepage+t,"_self")}},e.homepage="https://nekzor.github.io/",e.pageLinks=[{text:"Glitches",link:"glitches.html"},{text:"Least Portals",link:"lp"},{text:"Demo Parser",link:"parser.html"},{text:"Cvars",link:"cvars"}],e}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,r=t.currentTab,o=t.onTabChange,c=n.a.createElement("div",{className:a.list},n.a.createElement(O.a,null,n.a.createElement(x.a,{button:!0,key:0,onClick:this.gotoPage("index.html")},n.a.createElement(C.a,{primary:"nekzor.github.io"}))),n.a.createElement(v.a,null),n.a.createElement(O.a,null,this.pageLinks.map(function(t,a){return n.a.createElement(x.a,{button:!0,key:a,onClick:e.gotoPage("".concat(t.link))},n.a.createElement(C.a,{primary:t.text}))})));return n.a.createElement("div",{className:a.root},n.a.createElement(b.a,{position:"fixed"},n.a.createElement(L.a,null,n.a.createElement(k.a,{onClick:this.showDrawer(!0),className:a.menuButton,color:"inherit","aria-label":"Menu"},n.a.createElement(B.a,null)),n.a.createElement(D.a,{variant:"h6",color:"inherit"},"Least Portals")),n.a.createElement(q,{currentTab:r,handleTabChange:o})),n.a.createElement(w.a,{open:this.state.open,onClose:this.showDrawer(!1),onOpen:this.showDrawer(!0)},n.a.createElement("div",{tabIndex:0,role:"button",onClick:this.showDrawer(!1),onKeyDown:this.showDrawer(!1)},c)))}}]),t}(n.a.Component),W=Object(m.withStyles)(function(e){return{root:{paddingBottom:14*e.spacing.unit},list:{width:25*e.spacing.unit},menuButton:{marginLeft:-12,marginRight:20}}})(M),H=a(74),U=a.n(H),z=a(141),K=a.n(z),X=a(142),Y=a.n(X),G=a(140),J=a.n(G),V=a(20),Q=a.n(V),$=a(27),Z=a.n($),ee=a(30),te=a.n(ee),ae=a(47),re=a.n(ae),ne=a(48),oe=a.n(ne),ce=a(25),le=a.n(ce),ie=a(45),se=a.n(ie),ue=a(49),pe=a.n(ue),de=a(32),he=a.n(de),me=a(46),fe=a.n(me),be=a(24),ge=a.n(be),ve=function(e,t,a){var r=function(e,t){return t[a]<e[a]?-1:t[a]>e[a]?1:0},n="desc"===t?function(e,t){return r(e,t)}:function(e,t){return-r(e,t)};return e.map(function(e,t){return[e,t]}).sort(function(e,t){var a=n(e[0],t[0]);return 0!==a?a:e[1]-t[1]}).map(function(e){return e[0]})},Ee=[{id:"name",numeric:!1,sortable:!0,label:"Map"},{id:"score",numeric:!0,sortable:!0,label:"Portals"},{id:"wrDelta",numeric:!0,sortable:!0,label:"\u0394WR"}],we=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).createSortHandler=function(e){return function(t){a.props.onRequestSort(t,e)}},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.order,r=t.orderBy;return n.a.createElement(se.a,null,n.a.createElement(he.a,null,Ee.map(function(t){return n.a.createElement(le.a,{key:t.id,align:(t.numeric,"center"),padding:t.disablePadding?"none":"default",sortDirection:r===t.id&&a},!0===t.sortable&&n.a.createElement(ge.a,{title:"Sort",placement:t.numeric?"bottom-end":"bottom-start",enterDelay:300},n.a.createElement(fe.a,{active:r===t.id,direction:a,onClick:e.createSortHandler(t.id)},t.label)),!1===t.sortable&&t.label)},this)))}}]),t}(n.a.Component),ye=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).state={order:"asc",orderBy:"index",page:0,rowsPerPage:100},a.handleRequestSort=function(e,t){var r=t,n="desc";a.state.orderBy===t&&"desc"===a.state.order&&(n="asc"),a.setState({order:n,orderBy:r})},a.handleChangePage=function(e,t){a.setState({page:t})},a.handleChangeRowsPerPage=function(e){a.setState({rowsPerPage:e.target.value})},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.props,t=e.classes,a=e.data,r=this.state,o=r.order,c=r.orderBy,l=r.rowsPerPage,i=r.page,s=function(){return n.a.createElement(ge.a,{placement:"right",title:"Unknown score.",disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(te.a,{style:{cursor:"help"}},"n/a"))};return n.a.createElement("div",{className:t.root},n.a.createElement(re.a,{"aria-labelledby":"tableTitle"},n.a.createElement(we,{order:o,orderBy:c,onRequestSort:this.handleRequestSort,rowCount:a.length}),n.a.createElement(oe.a,null,ve(a,o,c).slice(i*l,i*l+l).map(function(e){var t=null!=e.score?e.score:n.a.createElement(s,null),a=null!=e.score?0===e.wrDelta?"":"+".concat(e.wrDelta):n.a.createElement(s,null);return n.a.createElement(he.a,{hover:!0,tabIndex:-1,key:e.id},n.a.createElement(le.a,{align:"center"},n.a.createElement(te.a,{target:"_blank",rel:"noopener",color:"inherit",href:"https://steamcommunity.com/stats/Portal2/leaderboards/".concat(e.id)},e.name)),n.a.createElement(le.a,{align:"center"},t),n.a.createElement(le.a,{align:"center"},a))}))),n.a.createElement(pe.a,{rowsPerPageOptions:[5,10,20,50,100],component:"div",count:a.length,rowsPerPage:l,page:i,labelDisplayedRows:function(){return""},backIconButtonProps:{"aria-label":"Previous Page"},nextIconButtonProps:{"aria-label":"Next Page"},onChangePage:this.handleChangePage,onChangeRowsPerPage:this.handleChangeRowsPerPage}))}}]),t}(n.a.Component),ke=Object(m.withStyles)(function(e){return{root:{overflowX:"auto"}}})(ye),Pe=a(89),Oe=a.n(Pe),je=function(e){return n.a.createElement(Oe.a,Object.assign({direction:"up"},e))},xe=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).gotoSteamProfile=function(e){window.open("https://steamcommunity.com/profiles/".concat(e),"_blank").opener=null},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,r=t.dialogOpen,o=t.handleClose,c=t.data;return n.a.createElement(n.a.Fragment,null,n.a.createElement(J.a,{fullScreen:!0,open:r,onClose:o,TransitionComponent:je},n.a.createElement(b.a,{position:"sticky"},n.a.createElement(L.a,null,n.a.createElement(ge.a,{placement:"bottom",title:"Open Steam profile",disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(K.a,{color:"inherit",onClick:function(){return e.gotoSteamProfile(c.id)}},n.a.createElement(U.a,{src:c.avatar}))),n.a.createElement(D.a,{variant:"h6",color:"inherit",className:a.flex},"\xa0\xa0\xa0",c.name),n.a.createElement(ge.a,{placement:"bottom",title:"Close profile",disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(k.a,{color:"inherit",onClick:o,"aria-label":"Close"},n.a.createElement(Y.a,null))))),0===c.entries.length&&n.a.createElement(h.a,null),n.a.createElement(Q.a,{container:!0,className:a.stats},n.a.createElement(Q.a,{item:!0,xs:!1,md:1,lg:3}),n.a.createElement(Q.a,{item:!0,xs:12,md:10,lg:6},0!==c.entries.length&&n.a.createElement(Q.a,{container:!0,spacing:24},n.a.createElement(Q.a,{item:!0,xs:12,md:4,lg:4},n.a.createElement(Z.a,{className:a.paper},n.a.createElement(ge.a,{placement:"top",title:0!==c.sp.score?"".concat(c.sp.score,"+").concat(-c.sp.delta):"",disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(D.a,{variant:"h3",gutterBottom:!0},0!==c.sp.percentage?c.sp.percentage:0,"%")),n.a.createElement(D.a,{variant:"subtitle1",gutterBottom:!0},"Single Player"))),n.a.createElement(Q.a,{item:!0,xs:12,md:4,lg:4},n.a.createElement(Z.a,{className:a.paper},n.a.createElement(ge.a,{placement:"top",title:0!==c.coop.score?"".concat(c.coop.score,"+").concat(-c.coop.delta):"",disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(D.a,{variant:"h3",gutterBottom:!0},0!==c.coop.percentage?c.coop.percentage:0,"%")),n.a.createElement(D.a,{variant:"subtitle1",gutterBottom:!0},"Cooperative"))),n.a.createElement(Q.a,{item:!0,xs:12,md:4,lg:4},n.a.createElement(Z.a,{className:a.paper},n.a.createElement(ge.a,{placement:"top",title:0!==c.overall.score?"".concat(c.overall.score,"+").concat(-c.overall.delta):"",disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(D.a,{variant:"h3",gutterBottom:!0},0!==c.overall.percentage?c.overall.percentage:0,"%")),n.a.createElement(D.a,{variant:"subtitle1",gutterBottom:!0},"Overall")))))),n.a.createElement(Q.a,{container:!0,className:a.records},n.a.createElement(Q.a,{item:!0,xs:!1,md:1,lg:3}),n.a.createElement(Q.a,{item:!0,xs:12,md:10,lg:6},n.a.createElement(Z.a,null,n.a.createElement(ke,{data:c.entries}))))))}}]),t}(n.a.Component),Se=Object(m.withStyles)(function(e){return{stats:{marginTop:3*e.spacing.unit},records:{marginTop:3*e.spacing.unit},flex:{flex:1},paper:{padding:5*e.spacing.unit,textAlign:"center"}}})(xe),Ce=function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(s.a)(this,Object(u.a)(t).call(this))).description=["This leaderboard includes all legit players who care about least portal records in Portal 2.","","How it works:","- Page generator fetches 5k entries per leaderboard due to the limit for one API call","- Some leaderboards are excluded because too many players are tied for 1st, 2nd rank etc.","- Users who tied the world record will be prioritized","- Cheaters with invalid scores will be ignored"],e.tooltip="Automatic ban system catches users who cheated at least once.",e}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.props,t=e.classes,a=e.data,r=this.description.map(function(e,t){return n.a.createElement(x.a,{key:t},n.a.createElement(D.a,{variant:"body1"},e))}),o=n.a.createElement(te.a,{rel:"noopener",href:"https://github.com/NeKzor/lp"},"GitHub"),c=n.a.createElement(ge.a,{placement:"right",title:this.tooltip,disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(te.a,{className:t.help},a.cheaters.length));return n.a.createElement(n.a.Fragment,null,n.a.createElement(Q.a,{container:!0},n.a.createElement(Q.a,{item:!0,xs:!1,md:1,lg:3}),n.a.createElement(Q.a,{item:!0,xs:12,md:10,lg:6},n.a.createElement(Z.a,{className:t.aboutBox},n.a.createElement(O.a,{className:t.list,dense:!0},n.a.createElement(x.a,null,n.a.createElement(D.a,{component:"h2",variant:"h5"},"Who's the lp king?")),r,n.a.createElement(x.a,null),n.a.createElement(x.a,null,n.a.createElement(D.a,{variant:"subtitle1"},"Project is open source at ",o,".")),n.a.createElement(x.a,null,n.a.createElement(D.a,{variant:"subtitle1"},"Number of detected cheaters: ",c)),n.a.createElement(x.a,null,n.a.createElement(D.a,{variant:"subtitle1"},"Last Update: ",a.export_date)))))))}}]),t}(n.a.Component),Te=Object(m.withStyles)(function(e){return{help:{cursor:"help"},aboutBox:{padding:3*e.spacing.unit}}})(Ce),Be=a(144),Re=a.n(Be),Le=a(72),Ne=a.n(Le),De=a(143),_e=a.n(De),Fe=[{id:"name",numeric:!1,sortable:!0,label:"Map"},{id:"wr",numeric:!0,sortable:!0,label:"Portals"},{id:"ties",numeric:!0,sortable:!0,label:"Ties"},{id:"video",numeric:!0,sortable:!1,label:"Video"}],Ae=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).createSortHandler=function(e){return function(t){a.props.onRequestSort(t,e)}},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.order,r=t.orderBy;return n.a.createElement(se.a,null,n.a.createElement(he.a,null,Fe.map(function(t){return n.a.createElement(le.a,{key:t.id,align:t.numeric?"center":"left",padding:t.disablePadding?"none":"default",sortDirection:r===t.id&&a},!0===t.sortable&&n.a.createElement(ge.a,{title:"Sort",placement:t.numeric?"bottom-end":"bottom-start",enterDelay:300},n.a.createElement(fe.a,{active:r===t.id,direction:a,onClick:e.createSortHandler(t.id)},t.label)),!1===t.sortable&&t.label)},this)))}}]),t}(n.a.Component),Ie=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).state={order:"asc",orderBy:"index",page:0,rowsPerPage:10},a.handleRequestSort=function(e,t){var r=t,n="desc";a.state.orderBy===t&&"desc"===a.state.order&&(n="asc"),a.setState({order:n,orderBy:r})},a.handleChangePage=function(e,t){a.setState({page:t})},a.handleChangeRowsPerPage=function(e){a.setState({rowsPerPage:e.target.value})},a.gotoYouTube=function(e){return function(){var t="Portal+2+".concat(e.name.replace(/ /g,"+"),"+in+").concat(e.wr,"+Portals");window.open("https://www.youtube.com/results?search_query=".concat(t),"_blank").opener=null}},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.classes,r=t.data,o=this.state,c=o.order,l=o.orderBy,i=o.rowsPerPage,s=o.page,u=function(){return n.a.createElement(ge.a,{placement:"right",title:"Disabled tracking records for this map.",disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(te.a,{className:a.helpLink},"n/a"))};return n.a.createElement("div",{className:a.root},n.a.createElement(re.a,{"aria-labelledby":"tableTitle"},n.a.createElement(Ae,{order:c,orderBy:l,onRequestSort:this.handleRequestSort,rowCount:r.length}),n.a.createElement(oe.a,null,ve(r,c,l).slice(s*i,s*i+i).map(function(t){return n.a.createElement(he.a,{hover:!0,tabIndex:-1,key:t.id},n.a.createElement(le.a,null,n.a.createElement(te.a,{target:"_blank",rel:"noopener",color:"inherit",href:"https://steamcommunity.com/stats/Portal2/leaderboards/".concat(t.id)},t.name)),n.a.createElement(le.a,{align:"center"},t.wr),n.a.createElement(le.a,{align:"center"},!0===t.excluded?n.a.createElement(u,null):t.ties),n.a.createElement(le.a,{align:"center"},n.a.createElement(ge.a,{placement:"right",title:"Search record on YouTube",disableFocusListener:!0,disableTouchListener:!0},n.a.createElement(k.a,{color:"primary",onClick:e.gotoYouTube(t)},n.a.createElement(_e.a,null)))))}))),n.a.createElement(pe.a,{rowsPerPageOptions:[5,10,20,50,100],component:"div",count:r.length,rowsPerPage:i,page:s,labelDisplayedRows:function(){return""},backIconButtonProps:{"aria-label":"Previous Page"},nextIconButtonProps:{"aria-label":"Next Page"},onChangePage:this.handleChangePage,onChangeRowsPerPage:this.handleChangeRowsPerPage}))}}]),t}(n.a.Component),qe=Object(m.withStyles)(function(e){return{root:{overflowX:"auto"},helpLink:{cursor:"help"}}})(Ie),Me=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).state={searchTerm:""},a.setSearchTerm=function(e){a.setState({searchTerm:e.target.value})},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"filterRecords",value:function(e){var t=this;return e.filter(function(e){return 0===t.state.searchTerm.length||e.name.toUpperCase().startsWith(t.state.searchTerm.toUpperCase())||e.wr===parseInt(t.state.searchTerm)})}},{key:"render",value:function(){var e=this.props,t=e.classes,a=e.data;return n.a.createElement(n.a.Fragment,null,n.a.createElement(Q.a,{container:!0},n.a.createElement(Q.a,{item:!0,xs:!1,md:1,lg:3}),n.a.createElement(Q.a,{item:!0,xs:12,md:10,lg:6},n.a.createElement(Z.a,{className:t.searchBox},n.a.createElement(Re.a,null,n.a.createElement(Ne.a,{placeholder:"Search",inputProps:{"aria-label":"Description"},onChange:this.setSearchTerm,disableUnderline:!0}))),n.a.createElement(Z.a,null,n.a.createElement(qe,{data:this.filterRecords(a)})))))}}]),t}(n.a.Component),We=Object(m.withStyles)(function(e){return{searchBox:{padding:10,marginBottom:3*e.spacing.unit}}})(Me),He=a(19),Ue=a.n(He),ze=a(29),Ke=a(60),Xe=a(75),Ye=a(145);Ke.b.add(Ye.a);var Ge,Je=[{id:"rank",numeric:!0,sortable:!1,label:"Rank"},{id:"name",numeric:!1,sortable:!1,label:"Player"},{id:"score",numeric:!0,sortable:!0,label:"Portals"}],Ve=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).createSortHandler=function(e){return function(t){a.props.onRequestSort(t,e)}},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this,t=this.props,a=t.order,r=t.orderBy;return n.a.createElement(se.a,null,n.a.createElement(he.a,null,Je.map(function(t){return n.a.createElement(le.a,{key:t.id,align:t.numeric?"center":"left",sortDirection:r===t.id&&a},!0===t.sortable&&n.a.createElement(ge.a,{title:"Sort",placement:t.numeric?"bottom-end":"bottom-start",enterDelay:300},n.a.createElement(fe.a,{active:r===t.id,direction:a,onClick:e.createSortHandler(t.id)},t.label)),!1===t.sortable&&t.label)})))}}]),t}(n.a.Component),Qe=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).state={order:"asc",orderBy:"score",page:0,rowsPerPage:10},a.handleRequestSort=function(e,t){var r=t,n="desc";a.state.orderBy===t&&"desc"===a.state.order&&(n="asc"),a.setState({order:n,orderBy:r})},a.handleChangePage=function(e,t){a.setState({page:t})},a.handleChangeRowsPerPage=function(e){a.setState({rowsPerPage:e.target.value})},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.props,t=e.classes,a=e.data,r=e.handleClickOpen,o=this.state,c=o.order,l=o.orderBy,i=o.rowsPerPage,s=o.page;return n.a.createElement("div",{className:t.root},n.a.createElement(re.a,null,n.a.createElement(Ve,{order:c,orderBy:l,onRequestSort:this.handleRequestSort,rowCount:a.length}),n.a.createElement(oe.a,null,ve(a,c,l).slice(s*i,s*i+i).map(function(e){var a=e.getProfile(),o=e.getStats();return n.a.createElement(he.a,{hover:!0,tabIndex:-1,key:e.id},n.a.createElement(le.a,{align:"center"},1===e.rank?n.a.createElement(Xe.a,{title:"Rank 1",icon:"medal",color:"#ffd700"}):2===e.rank?n.a.createElement(Xe.a,{title:"Rank 2",icon:"medal",color:"#C0C0C0"}):3===e.rank?n.a.createElement(Xe.a,{title:"Rank 3",icon:"medal",color:"#cd7f32"}):e.rank),n.a.createElement(le.a,null,n.a.createElement("div",{className:t.playerCell},n.a.createElement(U.a,{src:a&&a.avatar_link}),"\xa0\xa0\xa0\xa0\xa0\xa0",n.a.createElement(te.a,{className:t.clickLink,onClick:function(){return r(e.id)},color:"inherit"},a&&a.profile_name||e.id))),n.a.createElement(le.a,{align:"center"},n.a.createElement(ge.a,{placement:"top",title:"".concat(o.percentage,"% (").concat(e.score+o.delta,"+").concat(o.delta,")"),disableFocusListener:!0,disableTouchListener:!0},n.a.createElement("div",null,e.score))))}))),n.a.createElement(pe.a,{rowsPerPageOptions:[5,10,20,50,100],component:"div",count:a.length,rowsPerPage:i,page:s,labelDisplayedRows:function(){return""},backIconButtonProps:{"aria-label":"Previous Page"},nextIconButtonProps:{"aria-label":"Next Page"},onChangePage:this.handleChangePage,onChangeRowsPerPage:this.handleChangeRowsPerPage}))}}]),t}(n.a.Component),$e=Object(m.withStyles)(function(e){return{root:{overflowX:"auto"},playerCell:{display:"flex",alignItems:"center"},clickLink:{cursor:"pointer"}}})(Qe),Ze=n.a.createContext(),et=function(e){return function(t){return n.a.createElement(Ze.Consumer,null,function(a){return n.a.createElement(e,Object.assign({},a,t))})}},tt=et(function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(){return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(0!==this.props.data.length){e.next=3;break}return e.next=3,this.props.downloadBoard(this.props.boardType);case 3:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.props,t=e.data,a=e.dialogOpener;return n.a.createElement(n.a.Fragment,null,n.a.createElement(Q.a,{container:!0},n.a.createElement(Q.a,{item:!0,xs:!1,md:1,lg:3}),n.a.createElement(Q.a,{item:!0,xs:12,md:10,lg:6},n.a.createElement(Z.a,null,0===t.length&&n.a.createElement(h.a,null),n.a.createElement($e,{data:t,handleClickOpen:a})))))}}]),t}(n.a.Component)),at=a(146),rt=a.n(at),nt=a(76),ot=a.n(nt),ct=Object(m.createMuiTheme)({palette:{primary:{light:ot.a[300],main:ot.a[500],dark:ot.a[700]},secondary:{light:"#fff",main:"#fff",dark:"#fff"}},typography:{useNextVariants:!0}}),lt=function(e){function t(){var e,a;Object(l.a)(this,t);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(n)))).state={currentTab:0},a.handleTabChange=function(e,t){a.setState({currentTab:t})},a}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.props,t=e.classes,a=e.boards,r=a.sp,o=a.coop,c=a.overall,l=e.records,i=e.stats,s=e.currentProfile,u=e.cacheProfile,p=e.clearProfile,d=this.state.currentTab;return n.a.createElement(n.a.Fragment,null,n.a.createElement(W,{currentTab:d,onTabChange:this.handleTabChange}),0!==l.length?n.a.createElement("div",{className:t.views},0===d&&n.a.createElement(tt,{data:r,boardType:"sp",dialogOpener:u}),1===d&&n.a.createElement(tt,{data:o,boardType:"coop",dialogOpener:u}),2===d&&n.a.createElement(tt,{data:c,boardType:"overall",dialogOpener:u}),3===d&&n.a.createElement(We,{data:l}),4===d&&n.a.createElement(Te,{data:i})):n.a.createElement(h.a,null),s&&n.a.createElement(Se,{dialogOpen:null!==s,handleClose:p,data:s}))}}]),t}(n.a.PureComponent),it=(Ge=et(Object(m.withStyles)(function(e){return{views:{marginTop:3*e.spacing.unit}}})(lt)),function(e){return n.a.createElement(m.MuiThemeProvider,{theme:ct},n.a.createElement(rt.a,null),n.a.createElement(Ge,e))}),st=a(61),ut=a(77),pt=function(){function e(){Object(l.a)(this,e),this.baseApi="https://raw.githubusercontent.com/NeKzor/lp/api"}return Object(i.a)(e,[{key:"get",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(t){return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Fetching ".concat(t)),e.next=3,fetch(this.baseApi+t+".json");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"getProfiles",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(){var t;return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.get("/profiles");case 2:return t=e.sent,e.next=5,t.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"getRecords",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(){var t;return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.get("/wrs");case 2:return t=e.sent,e.next=5,t.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"getStats",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(){var t;return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.get("/stats");case 2:return t=e.sent,e.next=5,t.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"getBoard",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(t){var a;return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("sp"===t||"coop"===t||"overall"===t){e.next=2;break}throw new Error("Invalid board!");case 2:return e.next=4,this.get("/boards/".concat(t));case 4:return a=e.sent,e.next=7,a.json();case 7:return e.abrupt("return",e.sent);case 8:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"getPlayer",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(t){var a;return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.get("/players/".concat(t));case 2:return a=e.sent,e.next=5,a.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()}]),e}(),dt=function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(s.a)(this,Object(u.a)(t).call(this))).state={profiles:[],records:[],stats:[],currentProfile:null,boards:{sp:[],coop:[],overall:[]},calcWrDelta:function(t){return Math.abs(e.state.findRecord(t.id).wr-t.score)},findRecord:function(t){return e.state.records.find(function(e){return e.id===t})},findProfile:function(t){return e.state.profiles.find(function(e){return e.id===t})},cacheProfile:function(t){return e.cacheProfile(t)},clearProfile:function(){return e.setState({currentProfile:null})},downloadBoard:function(){var t=Object(ze.a)(Ue.a.mark(function t(a){return Ue.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.downloadBoard(a);case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},e.api=new pt,e.perfectScores={sp:0,coop:0,overall:0},e.playerCache={},e}return Object(p.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(){var t,a,r;return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.api.getProfiles();case 2:return t=e.sent,e.next=5,this.api.getRecords();case 5:return a=e.sent,e.next=8,this.api.getStats();case 8:r=e.sent,this.initRecords(r.tied_records,a),this.setState({records:a,stats:r,profiles:t});case 11:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"initRecords",value:function(e,t){var a=!0,r=!1,n=void 0;try{for(var o,c=t[Symbol.iterator]();!(a=(o=c.next()).done);a=!0){var l=o.value;l.ties=e[l.id],l.excluded?l.ties=0:(1===l.mode?this.perfectScores.sp+=l.wr:2===l.mode&&(this.perfectScores.coop+=l.wr),this.perfectScores.overall+=l.wr)}}catch(i){r=!0,n=i}finally{try{a||null==c.return||c.return()}finally{if(r)throw n}}}},{key:"downloadBoard",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(t){var a,r,n,o,c,l,i,s,u=this;return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=this,e.next=3,this.api.getBoard(t);case 3:r=e.sent,n=!0,o=!1,c=void 0,e.prev=7,l=r[Symbol.iterator]();case 9:if(n=(i=l.next()).done){e.next=28;break}if((s=i.value).getProfile=function(){var e=this;return void 0===this._profile&&(this._profile=a.state.profiles.find(function(t){return t.id===e.id})),this._profile},"sp"!==t){e.next=16;break}s.getStats=function(){return void 0===this._stats&&(this._stats={delta:this.score-a.perfectScores.sp,percentage:Math.round(a.perfectScores.sp/this.score*100)}),this._stats},e.next=25;break;case 16:if("coop"!==t){e.next=20;break}s.getStats=function(){return void 0===this._stats&&(this._stats={delta:this.score-a.perfectScores.coop,percentage:Math.round(a.perfectScores.coop/this.score*100)}),this._stats},e.next=25;break;case 20:if("overall"!==t){e.next=24;break}s.getStats=function(){return void 0===this._stats&&(this._stats={delta:this.score-a.perfectScores.overall,percentage:Math.round(a.perfectScores.overall/this.score*100)}),this._stats},e.next=25;break;case 24:throw new Error("Invalid board type!");case 25:n=!0,e.next=9;break;case 28:e.next=34;break;case 30:e.prev=30,e.t0=e.catch(7),o=!0,c=e.t0;case 34:e.prev=34,e.prev=35,n||null==l.return||l.return();case 37:if(e.prev=37,!o){e.next=40;break}throw c;case 40:return e.finish(37);case 41:return e.finish(34);case 42:this.setState(function(e){return{boards:Object(ut.a)({},e.boards,Object(st.a)({},t,r))}},function(){return console.log("Updated state:",u.state)});case 43:case"end":return e.stop()}},e,this,[[7,30,34,42],[35,,37,41]])}));return function(t){return e.apply(this,arguments)}}()},{key:"cacheProfile",value:function(){var e=Object(ze.a)(Ue.a.mark(function e(t){var a,r,n,o,c,l,i,s,u,p,d,h,m,f;return Ue.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==(a=this.playerCache[t])){e.next=37;break}return r=this.state.findProfile(t),a={id:t,name:r.profile_name,avatar:r.avatar_link,sp:0,coop:0,overall:0,entries:[]},this.setState({currentProfile:a}),e.next=7,this.api.getPlayer(t);case 7:for(n=e.sent,o=n.entries,c=n.sp_score,l=n.coop_score,i=n.overall_score,s=[],u=!0,p=!1,d=void 0,e.prev=16,h=o[Symbol.iterator]();!(u=(m=h.next()).done);u=!0)f=m.value,s.push({id:f.id,name:this.state.findRecord(f.id).name,score:f.score,wrDelta:this.state.calcWrDelta(f)});e.next=24;break;case 20:e.prev=20,e.t0=e.catch(16),p=!0,d=e.t0;case 24:e.prev=24,e.prev=25,u||null==h.return||h.return();case 27:if(e.prev=27,!p){e.next=30;break}throw d;case 30:return e.finish(27);case 31:return e.finish(24);case 32:a=Object(ut.a)({},a,{sp:{score:c,delta:c-this.perfectScores.sp,percentage:0!==c?Math.round(this.perfectScores.sp/c*100):0},coop:{score:l,delta:l-this.perfectScores.coop,percentage:0!==l?Math.round(this.perfectScores.coop/l*100):0},overall:{score:i,delta:i-this.perfectScores.overall,percentage:0!==c&&0!==l?Math.round(this.perfectScores.overall/i*100):0},entries:s}),this.setState({currentProfile:a}),this.playerCache=Object(ut.a)({},this.playerCache,Object(st.a)({},t,a)),e.next=39;break;case 37:console.log("From cache: ".concat(t)),this.setState({currentProfile:a});case 39:case"end":return e.stop()}},e,this,[[16,20,24,32],[25,,27,31]])}));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){return n.a.createElement(Ze.Provider,{value:this.state},this.props.children)}}]),t}(n.a.Component),ht=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function mt(e){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){"installed"===t.state&&(navigator.serviceWorker.controller?console.log("New content is available; please refresh."):console.log("Content is cached for offline use."))}}}).catch(function(e){console.error("Error during service worker registration:",e)})}var ft=n.a.createElement(dt,null,n.a.createElement(it,null));c.a.render(ft,document.querySelector("#root")),function(){if("serviceWorker"in navigator){if(new URL("/lp",window.location).origin!==window.location.origin)return;window.addEventListener("load",function(){var e="".concat("/lp","/service-worker.js");ht?(function(e){fetch(e).then(function(t){404===t.status||-1===t.headers.get("content-type").indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):mt(e)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ")})):mt(e)})}}()}},[[147,1,2]]]);
//# sourceMappingURL=main.ef926ac3.chunk.js.map