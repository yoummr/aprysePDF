import React, { useRef, useEffect } from "react";
import axios from "axios";

import WebViewer from "@pdftron/webviewer";

import "./App.css";

const apiEndpoint = "http://localhost:5000/api/AttchmentsDraws";

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount
  const updatedAnno = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields /><annots><square page="0" rect="100,592,300,642" color="#000000" flags="print" name="7dfe1cf3-1d78-fe6b-8fb1-f8d90afc0717" title="Rahman" subject="Rectangle" date="D:20241113103703-05'00'" creationdate="D:20241113103703-05'00'"/><square page="0" rect="322.53,586.47,548.09,708.73" color="#000000" flags="print" name="b8534ffc-d92c-02b4-2143-4ff1c86d9ee7" title="Rahman" subject="Rectangle" date="D:20241113103802-05'00'" creationdate="D:20241113103802-05'00'" dashes=""/><square page="0" rect="452.17,367.23,609.22,519.01" color="#000000" flags="print" name="8a5e0370-0303-2969-2b81-1e42b9dfd446" title="Rahman" subject="Rectangle" date="D:20241113103803-05'00'" creationdate="D:20241113103803-05'00'" dashes=""/><circle page="0" rect="130.7,687.65,224.51,747.73" color="#E44234" flags="print" name="f3437513-08a1-4e2f-bbf6-42814fac6b00" title="Rahman" subject="Ellipse" date="D:20241113103934-05'00'" creationdate="D:20241113103934-05'00'"/><circle page="0" rect="263.5,686.6,315.15,754.06" color="#E44234" flags="print" name="58ba341b-6d40-a2d3-67f6-4b1477c54999" title="Rahman" subject="Ellipse" date="D:20241113103935-05'00'" creationdate="D:20241113103935-05'00'"/></annots><pages><defmtx matrix="1,0,0,-1,0,792" /></pages></xfdf>`;

  useEffect(() => {
    // If you prefer to use the Iframe implementation, you can replace this line with: WebViewer.Iframe(...)

    WebViewer.WebComponent(
      {
        path: "/webviewer/lib",

        initialDoc: "/files/PDFTRON_about.pdf", // API url for getting file from API, from database.
        ui: "legacy",

        licenseKey:
          "demo:1731121654634:7efda14b0300000000d88442aeb7486771ed6c1b5dc3ea77601e2b2e98",
      },

      // linner doc streaming.

      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",

          img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',

          onClick: async () => {
            try {
              // Export annotations as XFDF
              const xfdfData = await annotationManager.exportAnnotations({
                links: false,
                widgets: false,
              });

              console.log("Exported XFDF Data:", xfdfData);

              const result = await axios
                .post(
                  "http://localhost:5000/api/AttchmentsDraws/SaveDraws",
                  xfdfData,
                  {
                    headers: {
                      "Content-Type": "application/xml",
                    },
                  }
                )
                .then((response) => {
                  console.log("Success:", response.data);
                })
                .catch((error) => {
                  console.error(
                    "Error:",
                    error.response?.data || error.message
                  );
                });

              alert("Annotations saved successfully!");
            } catch (error) {
              console.error("Error saving annotations:", error);
              alert("Failed to save annotations. Please try again.");
            }
          },
        });
      });
      documentViewer.setDocumentXFDFRetriever(async () => {
        // load the annotation data
        //'http://localhost:5000/api/AttchmentsDraws/GetDrawsById?id=1'
        //const response = await fetch("path/to/annotation/server");

        let result = await axios.get(
          "http://localhost:5000/api/AttchmentsDraws/GetDrawsById?id=1"
        );
        //const xfdfString = await response.text();
        //const xfdfString = decodeFromBase64(result.data);
        console.log(result.data);
        // <xfdf>
        // <annots>
        // <text subject="Comment" page="0" color="#FFE6A2" ... />
        // </annots>
        // </xfdf>
        //return xfdfString;
        return result.data;
      });

      documentViewer.addEventListener("documentLoaded", () => {
        annotationManager.setCurrentUser("Rahman");

        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,

          // values are in page coordinates with (0, 0) in the top left

          X: 100,

          Y: 150,

          Width: 200,

          Height: 50,

          Author: annotationManager.getCurrentUser(),
        });

        annotationManager.addAnnotation(rectangleAnnot);

        // need to draw the annotation otherwise it won't show up until the page is refreshed

        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>

      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
