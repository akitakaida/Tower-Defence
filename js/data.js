//全データ
const Data = {
    "TestStage":[60, 50000,
        [
            ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
            ["00", "12", "11", "11", "11", "11", "11", "11", "13", "00"],
            ["00", "10", "00", "00", "00", "00", "00", "00", "10", "00"],
            ["00", "10", "00", "00", "00", "00", "00", "00", "10", "00"],
            ["00", "10", "00", "00", "00", "00", "00", "00", "10", "00"],
            ["00", "10", "00", "00", "00", "00", "00", "00", "10", "00"],
            ["00", "10", "00", "00", "00", "00", "00", "00", "10", "00"],
            ["00", "10", "00", "00", "00", "00", "00", "00", "10", "00"],
            ["00", "10", "00", "00", "00", "00", "00", "00", "10", "00"],
            ["00", "60", "00", "00", "00", "00", "00", "00", "80", "00"]
        ],
        [
            1,
            [1,
                {
                    "Blue Enemy": 1, "Red Enemy": 1, "Green Enemy": 1,
                    "Hi-Blue Enemy": 1, "Hi-Red Enemy": 1, "Hi-Green Enemy": 1,
                    "Purple Enemy": 1, "Black Enemy": 1, "King Black": 1
                }
            ]
        ]
    ],
    "Stage 1":[
        //b
        60,
        //fund
        500,
        //FieldDATA
        [
            ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
            ["61", "11", "16", "11", "11", "11", "11", "11", "13", "00"],
            ["00", "00", "10", "00", "00", "00", "00", "00", "10", "00"],
            ["00", "00", "15", "13", "00", "00", "00", "00", "10", "00"],
            ["00", "00", "00", "15", "13", "00", "00", "00", "10", "00"],
            ["00", "00", "00", "00", "19", "11", "11", "11", "18", "81"],
            ["00", "00", "12", "11", "14", "00", "00", "00", "00", "00"],
            ["00", "00", "10", "00", "00", "00", "00", "00", "00", "00"],
            ["61", "11", "14", "00", "00", "00", "00", "00", "00", "00"],
            ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00"]
        ], 
        //EnemyDATA
        [
            5, //Level数
            //Level 1
            [3, //Wave数
                { "Blue Enemy": 2 },
                { "Red Enemy": 3, "Blue Enemy": 2 },
                { "Blue Enemy": 3, "Red Enemy": 5, "Green Enemy": 1 }
            ],
            //Level 2
            [3,
                { "Blue Enemy": 2, "Hi-Blue Enemy": 2, "Red Enemy": 6, "Green Enemy": 3},
                { "Blue Enemy": 4, "Red Enemy": 5, "Hi-Red Enemy": 5, "Green Enemy": 4},
                { "Blue Enemy": 6, "Red Enemy": 12, "Green Enemy": 3, "Hi-Green Enemy": 3 }
            ],
            //Level 3
            [3,
                { "Blue Enemy": 3, "Hi-Blue Enemy": 3, "Red Enemy": 6, "Hi-Red Enemy": 6, "Green Enemy": 3, "Hi-Green Enemy": 3, "Purple Enemy": 1},
                { "Blue Enemy": 4, "Hi-Blue Enemy": 4, "Red Enemy": 7, "Hi-Red Enemy": 7, "Green Enemy": 3, "Hi-Green Enemy": 3, "Purple Enemy": 2},
                { "Blue Enemy": 5, "Hi-Blue Enemy": 5, "Red Enemy": 8, "Hi-Red Enemy": 8, "Green Enemy": 4, "Hi-Green Enemy": 4, "Purple Enemy": 3}
            ],
            //Level 4
            [3,

                { "Blue Enemy": 5, "Hi-Blue Enemy": 5, "Red Enemy": 8, "Hi-Red Enemy": 8, "Green Enemy": 5, "Hi-Green Enemy": 4, "Purple Enemy": 3 },
                { "Blue Enemy": 6, "Hi-Blue Enemy": 6, "Red Enemy": 10, "Hi-Red Enemy": 10, "Green Enemy": 5, "Hi-Green Enemy": 5, "Purple Enemy": 4 },
                { "Blue Enemy": 8, "Hi-Blue Enemy": 8, "Red Enemy": 12, "Hi-Red Enemy": 12, "Green Enemy": 6, "Hi-Green Enemy": 6, "Purple Enemy": 5 }
            ],
            //Level 5
            [4,

                { "Blue Enemy": 10, "Hi-Blue Enemy": 10, "Red Enemy": 15, "Hi-Red Enemy": 15, "Green Enemy": 7, "Hi-Green Enemy": 7, "Purple Enemy": 6, "Black Enemy": 1},
                { "Blue Enemy": 15, "Hi-Blue Enemy": 15, "Red Enemy": 15, "Hi-Red Enemy": 15, "Green Enemy": 7, "Hi-Green Enemy": 7, "Purple Enemy": 8, "Black Enemy": 2},
                { "Blue Enemy": 20, "Hi-Blue Enemy": 20, "Red Enemy": 25, "Hi-Red Enemy": 25, "Green Enemy": 10, "Hi-Green Enemy": 10, "Purple Enemy": 10, "Black Enemy": 5},
                { "Blue Enemy": 20, "Hi-Blue Enemy": 20, "Red Enemy": 25, "Hi-Red Enemy": 25, "Green Enemy": 10, "Hi-Green Enemy": 10, "Purple Enemy": 10, "Black Enemy": 5, "King Black": 1}
            ]
        ]

    ],
    "Stage 2":[100, 200, [
        ["00", "62", "00", "00", "00", "00"],
        ["00", "10", "00", "00", "00", "00"],
        ["00", "10", "00", "00", "00", "00"],
        ["00", "15", "11", "11", "13", "00"],
        ["00", "00", "00", "00", "10", "00"],
        ["00", "00", "00", "00", "80", "00"]
        ], [3, 
            [2, {"Blue Enemy": 1}, {"Blue Enemy": 1, "Red Enemy": 2}],
            [2, {"Blue Enemy": 2, "Red Enemy":3}, {"Blue Enemy": 2, "Red Enemy": 2, "Green Enemy": 1}],
            [2, {"Blue Enemy": 3, "Red Enemy":6, "Green Enemy": 2}, {"Blue Enemy": 4, "Red Enemy": 6, "Green Enemy": 3}, {"Blue Enemy": 6, "Red Enemy": 8, "Green Enemy": 5}]
        ]
    ],
    "Stage 3":[60, 500,[
        ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
        ["61", "11", "13", "00", "00", "00", "12", "11", "11", "13"],
        ["00", "00", "10", "00", "00", "00", "10", "00", "00", "10"],
        ["00", "00", "10", "00", "00", "00", "10", "00", "00", "10"],
        ["00", "00", "15", "11", "11", "11", "14", "00", "00", "10"],
        ["00", "00", "00", "00", "00", "00", "00", "00", "00", "10"],
        ["00", "00", "00", "00", "00", "00", "00", "00", "00", "10"],
        ["00", "00", "12", "11", "11", "11", "11", "11", "11", "14"],
        ["00", "12", "14", "00", "00", "00", "00", "00", "00", "00"],
        ["00", "80", "00", "00", "00", "00", "00", "00", "00", "00"]
        ], [3,
        [2, {"Blue Enemy": 1, "Red Enemy": 1}, {"Blue Enemy":2, "Red Enemy": 1}],
        [2, { "Blue Enemy": 2, "Hi-Red Enemy": 2, "Red Enemy": 2 }, { "Hi-Blue Enemy": 1, "Hi-Red Enemy": 1, "Blue enemy": 2}],
        [3, { "Green Enemy": 2, "Blue Enemy": 4, "Red Enemy": 4 }, { "Hi-Green Enemy": 2, "Hi-Blue Enemy": 2, "Red Enemy": 4 }, { "Hi-Green Enemy": 2, "Hi-Blue Enemy": 4, "Hi-Red Enemy": 6 }]
        ]
    ],
    "Red Rush":[60, 500,[
        ["00", "62", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
        ["00", "10", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"],
        ["00", "19", "11", "11", "16", "11", "11", "16", "11", "11", "13", "00"],
        ["00", "10", "00", "00", "10", "00", "00", "10", "00", "00", "10", "00"],
        ["00", "19", "11", "11", "20", "11", "11", "20", "11", "11", "17", "00"],
        ["00", "10", "00", "00", "10", "00", "00", "10", "00", "00", "10", "00"],
        ["00", "19", "11", "11", "20", "11", "11", "20", "11", "11", "17", "00"],
        ["00", "10", "00", "00", "10", "00", "00", "10", "00", "00", "10", "00"],
        ["00", "15", "11", "11", "18", "11", "11", "18", "11", "11", "17", "00"],
        ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "80", "00"]
        ], [3, 
        [3, { "Red Enemy": 2 }, { "Red Enemy": 4 }, { "Red Enemy": 6 }],
        [3, { "Red Enemy": 10, "Hi-Red Enemy": 5 }, { "Red Enemy": 15, "Hi-Red Enemy": 5 }, { "Red Enemy": 15, "Hi-Red Enemy": 10 } ],
        [3, { "Red Enemy": 20, "Hi-Red Enemy": 10 }, { "Red Enemy": 30, "Hi-Red Enemy": 10 }, { "Red Enemy": 30, "Hi-Red Enemy": 20 } ]
        ]
    ]
}
