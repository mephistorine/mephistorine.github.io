import initWasm from "@vlcn.io/crsqlite-wasm"
import tblrx from "@vlcn.io/rx-tbl"
import { wdbRtc } from "@vlcn.io/sync-p2p"
import { Chart, registerables, registry } from "chart.js"
import { stringify as uuidStringify } from "uuid"
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';

Chart.register(WordCloudController, WordElement, ...registerables);

initWasm(() => "https://esm.sh/@vlcn.io/crsqlite-wasm@0.15.2/dist/crsqlite.wasm")
  .then(async (sqlite) => {
    const db = await sqlite.open("frontendconf")
    const rtc = await wdbRtc(db)
    const rx = tblrx(db)

    await db.exec(`CREATE TABLE IF NOT EXISTS frontendconf (
            "id" text primary key,
            "peerId" text,
            "word" text,
            "createTime" text
        );

        SELECT crsql_as_crr('frontendconf')`)

    const words = [
      {
        key: "hello",
        value: 3
      }
    ]

    const context = (document.getElementById("chart-demo") as HTMLCanvasElement).getContext("2d")

    let chart = new Chart(
      context,
      {
        type: WordCloudController.id,
        data: {
          labels: [],
          datasets: []
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }
    );

    db.execA("select word from frontendconf")
      .then((rows) => {
        if (rows.length <= 0) {
          return
        }

        const words = rows.map(([word]) => word)
        const countByWord: Record<string, number> = words.reduce((acc, curr) => {
          if (curr in acc) {
            acc[curr] = acc[curr] + 1
          } else {
            acc[curr] = 1
          }
        }, {})

        chart.data.labels = words
        chart.data.datasets = [
          {
            label: "",
            data: Object.values(countByWord).map((val) => 10 + val * 10)
          }
        ]
      })

    rx.onAny(() => {
      db.execA("select word from frontendconf")
        .then((rows) => {
          const words = rows.map(([word]) => word)
          const countByWord: Record<string, number> = words.reduce((acc, curr) => {
            if (curr in acc) {
              acc[curr] = acc[curr] + 1
            } else {
              acc[curr] = 1
            }
          }, {})

          chart.data.labels = words
          chart.data.datasets = [
            {
              label: "",
              data: Object.values(countByWord).map((val) => 10 + val * 10)
            }
          ]
        })
    })

    console.log(uuidStringify(rtc.siteId))

    rtc.onConnectionsChanged(console.log)
  })
