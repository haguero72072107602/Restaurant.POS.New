import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import dayjs from "dayjs/esm";
import {fnSetRangeDate} from "@core/utils/functions/functions";
import {Dropdown, DropdownOptions} from 'flowbite';

declare var DateRangePicker: any;

@Component({
  selector: 'app-daterange',
  standalone: true,
  imports: [],
  template: `
    <div id="dateRangePickerId" #dateRangePickerId class="flex items-center content-center w-[380px] gap-2">
      <div class="relative">
        <button id="dropdownButton" #dropdownButton data-dropdown-toggle="dropdownDelay" data-dropdown-delay="500"
                data-dropdown-trigger="hover"
                class="h-[40px] w-[100px] text-white bg-[#50D1AA]
                       font-medium rounded-lg text-[14px] flex items-center justify-center"
                type="button">Range
          <!--
          <svg class="ml-4 w-4 h-4 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
               width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
          </svg>
          -->
        </button>

        <!-- Dropdown menu -->
        <div id="dropdownMenu" #dropdownMenu
             class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDelayButton">
            <li>
              <button
                class="w-full  flex items-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                (click)="changeRangeSelected(RangeDateOperation.Day)">Day
              </button>
            </li>
            <li>
              <button
                class="w-full  flex items-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                (click)="changeRangeSelected(RangeDateOperation.Yestarday)">Yestarday
              </button>
            </li>
            <li>
              <button
                class="w-full  flex items-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                (click)="changeRangeSelected(RangeDateOperation.Last7Days)">Last 7 days
              </button>
            </li>
            <li>
              <button
                class="w-full  flex items-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                (click)="changeRangeSelected(RangeDateOperation.ThisMonth)">This month
              </button>
            </li>
            <li>
              <button
                class="w-full  flex items-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                (click)="changeRangeSelected(RangeDateOperation.LastMonth)">Last month
              </button>
            </li>
            <li>
              <button
                class="w-full  flex items-start px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                (click)="changeRangeSelected(RangeDateOperation.Last3Month)">Last 3 month
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="relative">
        <!--
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
               fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
          </svg>
        </div>
        -->
        <input name="start" #start type="text"
               datepicker datepicker-autohide
               aria-autocomplete="none"
               class="h-[40px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                      focus:ring-blue-500 focus:border-blue-500 block w-full
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                      dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="Date start">
      </div>
      <!--<span class="mx-1 text-gray-500"></span> -->
      <div class="relative">
        <!--
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
               fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
          </svg>
        </div>
        -->
        <input name="end" #end type="text"
               datepicker datepicker-autohide
               aria-autocomplete="none"
               class="h-[40px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                      focus:ring-blue-500 focus:border-blue-500 block w-full
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                      dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               placeholder="Date end">
      </div>
      <div class="relative">
        <button (click)="onProcess()"
                class="w-[40px] h-[40px] text-white bg-[#50D1AA] shadow text-center
                    font-semibold rounded-lg text-sm focus:outline-none
                    disabled:bg-gray-300
                    flex items-center justify-center">
          <svg fill="none" height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.9375 3.9375V15.8125L5.1875 17.0625H17.0625V3.9375H3.9375Z" fill="#F8F9FD" opacity="0.2"/>
            <path
              d="M3.9375 11.6932V4.5625C3.9375 4.39674 4.00335 4.23777 4.12056 4.12056C4.23777 4.00335 4.39674 3.9375 4.5625 3.9375H16.4375C16.6033 3.9375 16.7622 4.00335 16.8794 4.12056C16.9967 4.23777 17.0625 4.39674 17.0625 4.5625V16.4375C17.0625 16.6033 16.9967 16.7622 16.8794 16.8794C16.7622 16.9967 16.6033 17.0625 16.4375 17.0625H11.0966"
              stroke="#F8F9FD" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
            <path d="M10.5 12.375L5.5 17.375L3 14.875" stroke="white" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="1.5"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styleUrl: './daterange.component.css'
})
export class DateRangeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("dateRangePickerId", {static: true}) dateRangePickerElement!: ElementRef;
  @ViewChild("start", {static: true}) dateRangeStartElement!: ElementRef;
  @ViewChild("end", {static: true}) dateRangeEndElement!: ElementRef;

  @ViewChild("dropdownMenu", {static: true}) dropdownMenu!: ElementRef;
  @ViewChild("dropdownButton", {static: true}) dropdownButton!: ElementRef;


  @Output() onChangeDate = new EventEmitter<any>();
  @Input({required: true}) dateRange: RangeDateOperation = RangeDateOperation.ThisMonth;
  @Input({required: true}) emitInitialRange: boolean = false;
  dropdown!: Dropdown;
  protected readonly RangeDateOperation = RangeDateOperation;
  private dateRangePicker: any;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.dateRangePicker = new DateRangePicker(this.dateRangePickerElement.nativeElement, {
      maxDate: Date.now(),
      autohide: true
    });

    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,
      ignoreClickOutsideClass: false,
      onHide: () => {
        console.log('dropdown has been hidden');
      },
      onShow: () => {
        console.log('dropdown has been shown');
      },
      onToggle: () => {
        console.log('dropdown has been toggled');
      },
    };

    const instanceOptions = {
      id: 'dropdownMenu',
      override: true
    };

    this.dropdown = new Dropdown(this.dropdownMenu.nativeElement, this.dropdownButton.nativeElement,
      options, instanceOptions);

    this.changeRangeSelected(this.dateRange);

    if (this.emitInitialRange) this.onProcess()
  }


  ngOnDestroy(): void {
    this.dateRangePicker?.destroy();
  }

  onProcess() {
    this.onChangeDate?.emit(this.dateRangePicker.dates)
  }

  changeRangeSelected(range: RangeDateOperation) {
    //fnSetRangeDate(range, this.dateRangePicker);
    this.dropdown.hide()

    //this.dropdownButton!.nativeElement.textContent = range.toString();

    console.log(this.dropdownButton)
  }
}

