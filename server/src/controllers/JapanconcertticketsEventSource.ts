import { DefaultEventSource } from "./DefaultEventSource.js";
import { EventType, Event, EventCategoryEnum } from "../models/Event.js";
import * as cheerio from "cheerio";
import moment, { Moment } from 'moment';
import { log } from "../utils/logger.js";
moment().format();

class JapanconcertticketsEventSource extends DefaultEventSource {

    id = "japancheapo";
    CURRENCY = 'YEN';
    
    public getId(): string {
      return this.id
    };

    async searchEvent(query: string): Promise<Array<EventType>> {
      let events = [];
      // console.log("QUERY !!");
      return new Promise((resolve, reject) => resolve(events));
    }
    
    async scrapEvent(): Promise<Array<EventType>> {
      let events = new Array();

      log.info(`${this.id}: scrapping started`);

      for (let i = 1; i<18; i++) {
        log.info(`${this.id}: scrapping ongoing. page ${i}`);

        // const res = await fetch(`https://japancheapo.com/events/page/${i}/`);
        const res = await fetch("https://www.japanconcerttickets.com/wp-admin/admin-ajax.php", {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_jsuid=467596061; _referrer_og=https%3A%2F%2Fduckduckgo.com%2F; usprivacy=1---N; cmplz_saved_categories=[\"marketing\",\"statistics\",\"preferences\",\"functional\"]; cmplz_saved_services={}",
            "Referer": "https://www.japanconcerttickets.com/upcoming-events/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": "action=load_event_posts&atts=%7B%22cat%22%3A%2217%2C140%22%2C%22month%22%3A%22%22%2C%22previous_entries_text%22%3A%22Previous+Events%22%2C%22next_entries_text%22%3A%22Next+Events%22%2C%22limit%22%3A%2248%22%2C%22events_to_load%22%3A%2240%22%2C%22eventdetails%22%3A%22false%22%2C%22show_cdn_link%22%3A%22true%22%2C%22shorten_multidate%22%3A%22true%22%2C%22start_date_format%22%3A%22%22%2C%22showtime%22%3A%22true%22%2C%22show_end_time%22%3A%22false%22%2C%22show_end_date%22%3A%22false%22%2C%22show_timezone%22%3A%22false%22%2C%22show_timezone_abb%22%3A%22false%22%2C%22show_pagination%22%3A%22true%22%2C%22show_recurring_events%22%3A%22on%22%2C%22recurrence_number%22%3A%226%22%2C%22show_postponed_canceled_event%22%3A%22true%22%2C%22show_virtual_hybrid_event%22%3A%22false%22%2C%22show_hybrid_event%22%3A%22true%22%2C%22show_virtual_event%22%3A%22true%22%2C%22showtitle%22%3A%22true%22%2C%22enable_organizer_link%22%3A%22false%22%2C%22enable_venue_link%22%3A%22false%22%2C%22disable_event_title_link%22%3A%22false%22%2C%22enable_category_links%22%3A%22true%22%2C%22custom_category_link_target%22%3A%22_self%22%2C%22enable_tag_links%22%3A%22true%22%2C%22custom_tag_link_target%22%3A%22_self%22%2C%22disable_event_image_link%22%3A%22false%22%2C%22disable_event_button_link%22%3A%22false%22%2C%22custom_event_link_url%22%3A%22%22%2C%22single_event_page_link%22%3A%22defualt%22%2C%22custom_event_link_target%22%3A%22_self%22%2C%22whole_event_clickable%22%3A%22true%22%2C%22custom_organizer_link_target%22%3A%22_self%22%2C%22custom_venue_link_target%22%3A%22_self%22%2C%22show_callout_box%22%3A%22true%22%2C%22button_make_fullwidth%22%3A%22on%22%2C%22featured_events%22%3A%22false%22%2C%22show_callout_date%22%3A%22true%22%2C%22show_callout_date_range%22%3A%22false%22%2C%22callout_date_format%22%3A%22d%22%2C%22show_callout_time%22%3A%22false%22%2C%22show_callout_time_range%22%3A%22false%22%2C%22callout_time_format%22%3A%22g%3Ai+a%22%2C%22show_callout_month%22%3A%22true%22%2C%22show_callout_month_range%22%3A%22false%22%2C%22callout_month_format%22%3A%22M%22%2C%22show_callout_day_of_week%22%3A%22true%22%2C%22show_callout_day_of_week_range%22%3A%22false%22%2C%22callout_week_format%22%3A%22(D)%22%2C%22show_callout_year%22%3A%22false%22%2C%22show_callout_year_range%22%3A%22false%22%2C%22callout_year_format%22%3A%22Y%22%2C%22time%22%3Anull%2C%22past%22%3A%22future_events%22%2C%22venue%22%3A%22true%22%2C%22location%22%3A%22false%22%2C%22location_street_address%22%3A%22true%22%2C%22location_locality%22%3A%22true%22%2C%22show_location_state%22%3A%22true%22%2C%22location_postal_code%22%3A%22true%22%2C%22location_country%22%3A%22true%22%2C%22location_street_comma%22%3A%22true%22%2C%22location_locality_comma%22%3A%22true%22%2C%22show_location_state_comma%22%3A%22true%22%2C%22location_postal_code_comma%22%3A%22true%22%2C%22location_country_comma%22%3A%22true%22%2C%22show_postal_code_before_locality%22%3A%22true%22%2C%22organizer%22%3A%22false%22%2C%22price%22%3A%22false%22%2C%22weburl%22%3A%22false%22%2C%22website_link%22%3A%22default_text%22%2C%22custom_website_link_text%22%3A%22%22%2C%22custom_website_link_target%22%3A%22_self%22%2C%22categories%22%3A%22false%22%2C%22hide_comma_cat%22%3A%22false%22%2C%22tags%22%3A%22true%22%2C%22hide_comma_tag%22%3A%22false%22%2C%22button_align%22%3A%22off%22%2C%22show_data_one_line%22%3A%22true%22%2C%22show_preposition%22%3A%22false%22%2C%22show_ical_export%22%3A%22false%22%2C%22show_google_calendar%22%3A%22false%22%2C%22stack_label_icon%22%3A%22false%22%2C%22show_event_month_heading%22%3A%22true%22%2C%22show_colon%22%3A%22true%22%2C%22schema%22%3A%22true%22%2C%22message%22%3A%22No+future+events+found.%22%2C%22key%22%3A%22End+Date%22%2C%22order%22%3A%22ASC%22%2C%22orderby%22%3A%22meta_value%22%2C%22viewall%22%3A%22false%22%2C%22excerpt%22%3A%22false%22%2C%22excerpt_content%22%3A%22excerpt_show%22%2C%22showdetail%22%3A%22true%22%2C%22thumb%22%3A%22true%22%2C%22thumbsize%22%3A%22800%22%2C%22image_aspect_ratio%22%3A%22%22%2C%22thumbwidth%22%3A%22800%22%2C%22thumbheight%22%3A%22800%22%2C%22contentorder%22%3A%22thumbnail%2Ctitle%2C+title2%2C+date%2C+venue%2C+location%2C+organizer%2C+price%2Ccategories%2C+tags%2C+weburl%2Cexcerpt%2Cshowcalendar%2Cshowical%2Cshowdetail%22%2C%22event_tax%22%3A%22%22%2C%22blog_offset%22%3A%220%22%2C%22cut_off_start_date%22%3A%22%22%2C%22cut_off_end_date%22%3A%22%22%2C%22event_past_future_cut_off%22%3A%22start_date%22%2C%22cutoff_ongoing_events%22%3A%22cut_end_date_reached%22%2C%22dateformat%22%3A%22H%3Ai%22%2C%22timeformat%22%3A%22%22%2C%22list_columns%22%3A%221%22%2C%22cover_columns%22%3A%223%22%2C%22layout%22%3A%22grid%22%2C%22list_layout%22%3A%22calloutleftimage_rightdetail%22%2C%22columns%22%3A%224%22%2C%22columns_phone%22%3A%22%22%2C%22columns_tablet%22%3A%22%22%2C%22list_columns_phone%22%3A%22%22%2C%22list_columns_tablet%22%3A%22%22%2C%22cover_columns_phone%22%3A%22%22%2C%22cover_columns_tablet%22%3A%22%22%2C%22cards_spacing%22%3A%22%22%2C%22image_align%22%3A%22topimage_bottomdetail%22%2C%22event_inner_spacing%22%3A%224px%7C7px%7C4px%7C7px%7Ctrue%7Ctrue%22%2C%22view_more_text%22%3A%22Tickets+%26+Details%22%2C%22ajax_load_more_text%22%3A%22Load+More+Events%22%2C%22datetime_separator%22%3A%22+%2F+%22%2C%22time_range_separator%22%3A%22+-+%22%2C%22google_calendar_text%22%3A%22Google+Calendar%22%2C%22ical_text%22%3A%22Ical+Export%22%2C%22open_toggle_background_color%22%3A%22RGBA(255%2C255%2C255%2C0)%22%2C%22details_link_color%22%3A%22%22%2C%22details_icon_color%22%3A%22%22%2C%22details_label_color%22%3A%22%22%2C%22included_categories%22%3A%2217%2C140%22%2C%22included_organizer%22%3A%5B%22%22%5D%2C%22included_organizer_check%22%3A%22%22%2C%22included_venue%22%3A%5B%22%22%5D%2C%22included_venue_check%22%3A%22%22%2C%22included_series%22%3A%5B%22%22%5D%2C%22included_series_check%22%3A%22%22%2C%22date_selection_type%22%3A%22none%22%2C%22event_by_reletive_date%22%3A%22week%22%2C%22included_date_range_start%22%3A%22%22%2C%22included_date_range_end%22%3A%22%22%2C%22header_level%22%3A%22h4%22%2C%22custom_icon%22%3A%22%22%2C%22event_selection%22%3A%22custom_event%22%2C%22custom_icon_tablet%22%3A%22%22%2C%22custom_icon_phone%22%3A%22%22%2C%22ajax_load_more_button_icon%22%3A%22%26%23x45%3B%22%2C%22ajax_load_more_button_icon_tablet%22%3A%22%22%2C%22ajax_load_more_button_icon_phone%22%3A%22%22%2C%22custom_view_more%22%3A%22off%22%2C%22view_more_on_hover%22%3A%22on%22%2C%22custom_ajax_load_more_button%22%3A%22on%22%2C%22ajax_load_more_button_on_hover%22%3A%22on%22%2C%22view_more_icon_placement%22%3A%22right%22%2C%22ajax_load_more_button_icon_placement%22%3A%22right%22%2C%22pagination_type%22%3A%22load_more%22%2C%22align%22%3A%22center%22%2C%22pagination_align%22%3A%22Right%22%2C%22show_icon_label%22%3A%22label%22%2C%22module_css_class%22%3A%22%22%7D&type=POST&dateType=html&eventfeed_current_page=1&eventfeed_page=load_more&eventfeed_prev_page=0&eventfeed_current_pagination_page=1&categId=&categslug=&term_id=%5B%5D&pagination_type=load_more&class_pagination=.decm_event_display_0_tb_body&filter_event_category=&event_filter_organizer=&event_filter_tag=&event_filter_venue=&event_filter_search=&event_filter_time=&event_filter_day=&event_filter_month=&event_filter_year=&event_maxCost=&event_minCost=&event_startDate=&event_endDate=&event_filter_country=&event_filter_city=&event_filter_state=&event_filter_address=&event_filter_order=&event_filter_page=Page&event_filter_status=&event_filter_recurring=&search_search_criteria=search_content_title",
          "method": "POST"
          });

        const html = await res.text();

        const $ = cheerio.load(html);
        
        $("article").each((index, element) => {

          let val = $(element).find('.entry-title').find('a').attr('href') || "";
          let anEvent = new Event(val);

          // val = $(element).find(".cheapo-archive-thumb").attr("alt") || "";
          // anEvent.teaserText = val.trim();
          
          // // TO DEBUG
          // // let _val = $(element).find(".cheapo-archive-thumb").toString() || "";
          // val = $(element).find(".cheapo-archive-thumb").attr("src") || "";

          // anEvent.teaserMedia = val.trim();

          // we can extract many things from the title
          val = $(element).find('.entry-title.title1').find('a').text().trim() || "";
          let _ = "";
          [_ , 
            anEvent.name, 
            anEvent.description,
            _,
            anEvent.placeFreeform,
            anEvent.datetimeFreeform
          ] = (/(.*)( in )([A-Za-z0-9_]*), (....-..-..)/.exec(val) || val);
          anEvent.teaserFreeform = val;

          anEvent.name = val;

          log.debug("NAME: " + anEvent.name);

          // val = $(element).find(".card__content").find(".card__excerpt").text() || "";
          // anEvent.description = val.trim();

          // // SCHEDULE date
          // // - keep only numbers, month name. everything else = blank
          // // - remove duplicates space
          // // - split by space
          // // - if only a month name: assume full month
          // // - if more than 2 elements: assume a two days+ event
          // val = $(element).find(".card--event__date-box").text() || "";          
          // let monthList: string [] = ['jan', 'feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
          // let dates: string[] = val
          //   .toLowerCase()
          //   .replace(/\\n/g, ' ')
          //   .replace(/\s\s+/g, ' ')
          //   .split(' ').filter(
          //     (value) => {
          //       if (monthList.indexOf(value.trim()) >= 0) return true;
          //       if (isNaN(parseInt(value, 10))) return false;
          //       return true;
          //     }
          //   )

          // // try to guess the year. only futur event are displayed on the website.
          // // ! 0 based
          // let currentMonth = moment().month();
          // let eventYear = moment().year();
          // let begin: Moment = moment();
          // let end: Moment = moment();

          // if (dates.length === 1 && monthList.indexOf(dates[0]) >= 0) {
          //   // full month event

          //   let eventMonthIndex = monthList.indexOf(dates[0])
          //   if (eventMonthIndex < currentMonth) {
          //     eventYear++;
          //   }

          //   begin = moment([eventYear, eventMonthIndex]);
          //   end = moment(begin).endOf('month');

          // } else if (dates.length === 2 
          //   && monthList.indexOf(dates[0]) >= 0
          //   && monthList.indexOf(dates[1]) >= 0) {
          //   // 2 months long (ex: nov - dec)  
          //   begin = moment([eventYear, monthList.indexOf(dates[0])]);
          //   end = moment([eventYear, monthList.indexOf(dates[1])]).endOf('month');

          // } else if (dates.length === 2) {
          //   // one day event
          //   // make sure, day number is first, then month name
          //   dates.sort();
          //   let eventDay = dates[0];
          //   let eventMonth = dates[1];
          //   let eventMonthIndex = monthList.indexOf(eventMonth);
          //   if (eventMonthIndex < currentMonth) {
          //     eventYear++;
          //   }

          //   begin = moment([eventYear, eventMonthIndex, eventDay]);
          //   end = moment(begin).endOf('day');
            
          // } else if (dates.length === 4) {
          //   // event span more than 1 day.
          //   // FIXME: begin/end assumed to be on the same year ...
          //   let datesBegin = [dates[0], dates[1]].sort();
          //   let datesEnd = [dates[2], dates[3]].sort();

          //   let eventBeginDay = datesBegin[0];
          //   let eventBeginMonth = datesBegin[1];
          //   let eventBeginMonthIndex = monthList.indexOf(eventBeginMonth);
          //   if (eventBeginMonthIndex < currentMonth) {
          //     eventYear++;
          //   }

          //   let eventEndDay = datesEnd[0];
          //   let eventEndMonth = datesEnd[1];
          //   let eventEndMonthIndex = monthList.indexOf(eventEndMonth);

          //   begin = moment([eventYear, eventBeginMonthIndex, eventBeginDay]);
          //   end = moment([eventYear, eventEndMonthIndex, eventEndDay]).endOf('day');

          // }
          
          // // SCHEDULE time
          // val = $(element).find('[title*="end time"]').next().text().toLocaleLowerCase() || "";
          // anEvent.datetimeFreeform = val.trim();
          // if (val.length > 0) {
          //   // format is like "9:00am – 5:00pm"
          //   let cmp = val.split(' ');
          //   let beginCmp: string, endCmp: string;
          //   if (cmp.length === 1) {
          //     // only start time.
          //     beginCmp = val.trim();
          //     endCmp = beginCmp;
          //   } else {
          //     beginCmp = cmp[0].trim();
          //     endCmp = cmp[2].trim();
          //   }
          //   let startTime = moment(beginCmp, "h:ma");
          //   let endTime = moment(endCmp, "h:ma");

          //   begin.hour(startTime.hour());
          //   begin.minute(startTime.minute());
          //   end.hour(endTime.hour());
          //   end.minute(endTime.minute());
          // }

          // // SCHEDULE time and date are saved in combo
          // anEvent.datetimeFrom = begin.toDate();
          // anEvent.datetimeTo = end.toDate();
          
          // // FEE
          // val = $(element).find('[title*="Entry"]').parent().text() || "";
          // anEvent.budgetFreeform = val.trim();
          // if (val.trim().toLowerCase() === "free" || val.trim().length === 0) {
          //   anEvent.budgetMin = 0
          //   anEvent.budgetMax = 0
          // } else {
          //   // format is like "¥400 – ¥1,000" or "¥500 (at the door)"
          //   // keep only ¥XXXX
          //   let prices: number[] = [];
          //   for (let cmp of anEvent.budgetFreeform.split(' ')) {
          //     let cmp2 = cmp.replace(/\D/g,'');
          //     if (cmp2.length > 0) {
          //       prices.push(Number(cmp2))
          //     }
          //   }
          //   prices.sort( (a, b) => { return a-b });
          //   if (prices.length === 1) {
          //     anEvent.budgetMin = anEvent.budgetMax = prices[0];
          //   } else {
          //     anEvent.budgetMin = prices[0];
          //     anEvent.budgetMax = prices[prices.length-1];
          //   }
          // }
          // anEvent.budgetCurrency = this.CURRENCY;

          // // CATEGORY
          // val = $(element).find('[title*="Category"]').parent().text() || "";
          // for (let c in EventCategoryEnum) {
          //   let normalizedCategoryName = EventCategoryEnum[c];
          //   for (let word of val.toLocaleLowerCase().trim().split(' ')) {
          //     if (normalizedCategoryName.toLowerCase().indexOf(word) >= 0) {
          //       anEvent.category = EventCategoryEnum[c];
          //       break;
          //     }
          //   }
          // }
          // anEvent.categoryFreeform = val.trim();

          // // LOCATION
          // val = $(element).find('.card__category').text() || "";
          // anEvent.placeFreeform = val.trim();

          events.push(anEvent);
        });

      }
      log.info(`${this.id}: scrapping done. ${events.length} found.`);

      return new Promise((resolve, reject) => resolve(events));
    }
  }

export { JapanconcertticketsEventSource }