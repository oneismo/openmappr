angular.module('common')
    .controller('FilterPanelParentCtrl', ['$scope', 'FilterPanelService', 'AttrInfoService', 'BROADCAST_MESSAGES',
        function($scope, FilterPanelService, AttrInfoService, BROADCAST_MESSAGES) {
            'use strict';

            /*************************************
    ************ Local Data **************
    **************************************/
            // var logPrefix = '[ctrlFilterPanelParent: ] ';


            /*************************************
    ********* Scope Bindings *************
    **************************************/
            /**
    *  Scope data
    */
            $scope.ui = {
                enableFilters: FilterPanelService.getFiltersVis(),
                renderDistr: false,
                activeFilterCount: 0,
                statsSearchKey: '',
                totalAttrsCount: null,
                filteredAttrs: []
            };

            $scope.enableUndo = false;
            $scope.enableRedo = false;

            /**
    * Scope methods
    */
            $scope.toggleFiltersVisibility = function() {
                $scope.$broadcast('TOGGLEFILTERS');
            };

            $scope.resetFilters = function() {
                $scope.$broadcast('RESETFILTERS');
            };

            $scope.attrSearched = function() {
                $scope.$broadcast(BROADCAST_MESSAGES.fp.attrSearched, {query: $scope.ui.statsSearchKey});
            };

            /**
     * This applies/subsets the `selected` filters
     */
            $scope.subsetFilters = function subsetFilters() {
                $scope.$broadcast(BROADCAST_MESSAGES.fp.filter.changed);
            };

            $scope.undoFilters = function undoFilters() {
                $scope.$broadcast(BROADCAST_MESSAGES.fp.filter.undo);
            };

            $scope.redoFilters = function redoFilters() {
                $scope.$broadcast(BROADCAST_MESSAGES.fp.filter.redo);
            };


            /*************************************
    ****** Event Listeners/Watches *******
    **************************************/
            $scope.$on(BROADCAST_MESSAGES.selectStage, function() {
                $scope.$evalAsync(function() {
                    FilterPanelService.resetFilters();
                    FilterPanelService.rememberSelection(false);
                });
            });

            $scope.$on(BROADCAST_MESSAGES.dataGraph.loaded, function() {
                FilterPanelService.rememberSelection(false);
            });

            $scope.$on(BROADCAST_MESSAGES.layout.attrClicked, function(event, data) {
                var infoObj = AttrInfoService.getNodeAttrInfoForRG();
                var attr = data.attr;
                if(AttrInfoService.isDistrAttr(attr, infoObj.getForId(attr.id))) {
                    $scope.ui.statsSearchKey = attr.title;
                    $scope.attrSearched();
                }
            });

            $scope.$on(BROADCAST_MESSAGES.fp.filter.undoRedoStatus, function(evt, undoRedoStatus) {
                $scope.enableUndo = undoRedoStatus.enableUndo;
                $scope.enableRedo = undoRedoStatus.enableRedo;
            });

            $scope.$on(BROADCAST_MESSAGES.fp.filter.reset, function handleReset() {
                $scope.enableUndo = false;
                $scope.enableRedo = false;
            });

            /*************************************
    ********* Initialise *****************
    **************************************/

            /*************************************
    ********* Core Functions *************
    **************************************/

        }
    ]);
