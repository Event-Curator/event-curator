interface IEventSource {
  
  // must return the lowcase key that can be found in the sources.json config file
  getId: () => string


  searchEvent: (query: string) => Promise<Array<string>>

}

export { IEventSource }