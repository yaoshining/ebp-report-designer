/**
 * Created by yaoshining on 16/8/15.
 */
import WidgetSelector from '../comp/WidgetSelector';
import SideMenu from '../comp/SideMenu';
import Report from '../comp/Report';
import Bloc from '../comp/Bloc';

function ReportDesignerDirectiveFactory():ng.IDirective {

    function linkFunc(scope, elem, attrs, designer) {
        elem.addClass('report-designer');
        const reportElem = elem.find('.report-wrapper'),
              headerElem = reportElem.find('.report-header'),
              bodyElem = reportElem.find('.report-body');

        headerElem.on('click', e => {
            headerElem.toggleClass('active');
        });

        elem.on('contextmenu', () => {
            designer.widgetSelector.toggle();
            scope.$digest();
            return false;
        });
    }

    let directive = {
        restrict: 'AE',
        link: linkFunc,
        templateUrl: 'src/designer/templates/designer.tpl.html',
        controller: DesignerController,
        controllerAs: '$designer'
    };

    return directive;
}

class DesignerController implements ng.IController{

    widgetSelector: any;
    sidemenu: any;
    report: any;
    select: any;
    selectedItem: any;
    preview: () => void;
    save: () => void;

    constructor($scope, $element, yaoFullscreen, reportService) {
        'ngInject';
        this.widgetSelector = WidgetSelector.$invoke(this, {$scope, $element});
        this.sidemenu = $scope.sidemenu = SideMenu.$invoke(this, {$scope, $element});
        this.report = Report.$invoke(this, {$scope, $element});
        this.select = item => {
            if(this.selectedItem) {
                this.selectedItem.element.removeClass('selected');
            }
            this.selectedItem = item;
            item.element.addClass('selected');
            this.sidemenu.refresh();
        };
        this.preview = () => {
            yaoFullscreen.open({
                templateUrl: 'src/designer/templates/preview.tpl.html',
                controller: 'ReportPreviewController',
                controllerAs: '$preview',
                resolve: {
                    report: this.report
                }
            });
        };
        this.save = () => {
            reportService.save(this.report);
        };
    }

    addBloc() {
        const block = new Bloc(this.report);
        this.report.insertBloc(block);
    }

}

class PreviewController implements ng.IController{

    constructor($scope, private yaoFullscreen, report, private $element) {
        'ngInject';
        $scope.$report = report;
    }

    close() {
        this.yaoFullscreen.close();
    };

    print() {
        print();
    };

    exportHTML() {
        angular.download(this.$element.find('.report-wrapper')[0])
    }

}


export default ReportDesignerDirectiveFactory;