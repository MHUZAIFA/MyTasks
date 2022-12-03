export class DateRange {
  begin: Date | null;
  end: Date | null;

  constructor(fromDate: Date | null, toDate: Date | null) {
    this.begin = fromDate;
    this.end = toDate;
  }

  public equal(dateRange: DateRange): boolean {
    return this.begin === dateRange.begin && this.end === dateRange.end;
  }

  clone(): DateRange {
    return new DateRange(this.begin, this.end);
  }
}
