Ext.define('CArABU.technicalservices.plugin.TrackingCardContentLeft', {
       alias: 'plugin.trackingcardcontentleft',
       extend: 'Rally.ui.cardboard.plugin.CardContentLeft',

       statics: {
           getIdTpl: function() {
               if (!this.idTpl) {
                   this.idTpl = Ext.create('Rally.ui.renderer.template.FormattedIDTemplate');
               }
               return this.idTpl;
           },

           getHeaderTpl: function() {
               if (!this.headerTpl) {
                   this.headerTpl = Ext.create('Ext.XTemplate', [
                       '<div class="left-header">',
                        '<div class="id" style="min-width: {idWidth}px">{formattedId}</div>',
                           '<div class="dependency {dep} field-content dependency"></div>', //{depID}
                           '<div class="itemstate {state}"></div>',
                           '<div class="field-content ItemSummary">{summary}</div>',
                           '</span>',
                       '</div>']);
               }
               return this.headerTpl;
           }
       },

       nonDisplayableFields: ['PlanEstimate', 'FormattedID', 'Owner', 'PreliminaryEstimate', 'Estimate'],

       getCardHeader: function() {
             var record = this.card.getRecord(),
             rData = Ext.clone(record.getData()),
                 groupedItem = rData.__groupedItem,
                 dependency = rData.__dependency,
                 childDeps = record.hasDependencies(),
                 formattedId = rData.FormattedID,
                 usePoints = this.card.usePoints,
                 data = {};
                 data.dep = "";
                 data.depID = "";

               if (this.card.usePoints){
                 data.summary = Ext.String.format("{0} / {1}", record.get('__acceptedPoints'), record.get('__totalPoints'));
               } else {
                 data.summary = Ext.String.format("{0} / {1}", record.get('__acceptedCount'), record.get('__totalCount'));
               }

              if (groupedItem){
                data.formattedId = "<div class='formatted-id-template'>" + record.getGroupName() + "</div>";
                data.idWidth = 20 + (record.getGroupName().length * 8);
                if (dependency){
                   data.dep = "type-indicator picto icon-predecessor" ;
                   data.depID = dependency;
                }
                return this.self.getHeaderTpl().apply(data);
              }

              if (formattedId) {
                 data.idWidth = 20 + (formattedId.length * 8);
                 var recordData = record.get('__items') && record.get('__items')[0];
                 if (childDeps){
                    data.dep = "type-indicator picto icon-predecessor";
                 }

                 //KMC - added logic to show status indicator for done states and at risk
                 data.state = "";
                 var status = record.getStatus();
                 console.log('status', status);
                 switch(status){
                   case "done":
                      data.state = "icon-ok done";
                      break;
                   case "atrisk":
                    data.state = "icon-warning atrisk";
                    break;
                  case "willnotcomplete":
                    data.state = "icon-minus willnotcomplete";
                    break;
                 }

                 data.formattedId = Rally.ui.cardboard.plugin.CardContentLeft.getIdTpl().apply(recordData);
                 return this.self.getHeaderTpl().apply(data);
             }
             return '';
         },
         _isDisplayableField: function(fieldName){
           var record = this.card.getRecord(),
               groupedItem = record.get('__isOrphan') && !record.get('__isHidden');

            if (groupedItem){
              return false;
            }
            return !_.contains(this.nonDisplayableFields.concat(this.footerFields), fieldName);
          }
   });
