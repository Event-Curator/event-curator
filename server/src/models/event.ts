interface IEventSource {
  
  // must return the lowercase key that can be found in the sources.json config file
  getId: () => string

  searchEvent: (query: string) => Promise<Array<string>>

}

export { IEventSource }
