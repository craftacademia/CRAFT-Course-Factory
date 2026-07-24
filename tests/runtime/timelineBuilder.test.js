import TimelineBuilder from "../../src/runtime/builders/timelineBuilder.js";

const builder = new TimelineBuilder();

const page = {

  layers: [

    {

      components: [

        {
          id: "A",
          start: 0,
          duration: 5
        },

        {
          id: "B",
          start: 5,
          duration: 3
        }

      ]

    }

  ]

};

console.log(JSON.stringify(builder.build(page), null, 2));