class WorldRoads {

    constructor(scene) {

        this.scene = scene;

        this.roadMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x292929,
                roughness: 0.9
            });

        this.lineMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.7
            });

        this.sidewalkMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x777777,
                roughness: 0.9
            });

        this.createCityRoads();
    }


    // ==========================================
    // MAIN CITY ROADS
    // ==========================================

    createCityRoads() {

        // Horizontal roads

        const horizontalRoads = [
            -120,
            -60,
            0,
            60,
            120
        ];

        horizontalRoads.forEach(z => {
            this.createRoad(
                0,
                z,
                500,
                18,
                "horizontal"
            );
        });


        // Vertical roads

        const verticalRoads = [
            -120,
            -60,
            0,
            60,
            120
        ];

        verticalRoads.forEach(x => {
            this.createRoad(
                x,
                0,
                18,
                500,
                "vertical"
            );
        });
    }


    // ==========================================
    // ROAD
    // ==========================================

    createRoad(
        x,
        z,
        width,
        depth,
        direction
    ) {

        const geometry =
            new THREE.BoxGeometry(
                width,
                0.08,
                depth
            );

        const road =
            new THREE.Mesh(
                geometry,
                this.roadMaterial
            );

        road.position.set(
            x,
            0.03,
            z
        );

        road.receiveShadow = true;

        this.scene.add(road);


        this.createLaneMarkings(
            x,
            z,
            width,
            depth,
            direction
        );

        this.createSidewalks(
            x,
            z,
            width,
            depth,
            direction
        );
    }


    // ==========================================
    // LANE MARKINGS
    // ==========================================

    createLaneMarkings(
        x,
        z,
        width,
        depth,
        direction
    ) {

        if (direction === "horizontal") {

            for (
                let lineX = -240;
                lineX <= 240;
                lineX += 12
            ) {

                const geometry =
                    new THREE.BoxGeometry(
                        6,
                        0.02,
                        0.18
                    );

                const line =
                    new THREE.Mesh(
                        geometry,
                        this.lineMaterial
                    );

                line.position.set(
                    lineX,
                    0.09,
                    z
                );

                this.scene.add(line);
            }

        } else {

            for (
                let lineZ = -240;
                lineZ <= 240;
                lineZ += 12
            ) {

                const geometry =
                    new THREE.BoxGeometry(
                        0.18,
                        0.02,
                        6
                    );

                const line =
                    new THREE.Mesh(
                        geometry,
                        this.lineMaterial
                    );

                line.position.set(
                    x,
                    0.09,
                    lineZ
                );

                this.scene.add(line);
            }
        }
    }


    // ==========================================
    // SIDEWALKS
    // ==========================================

    createSidewalks(
        x,
        z,
        width,
        depth,
        direction
    ) {

        if (direction === "horizontal") {

            this.createSidewalk(
                0,
                z - 11,
                500,
                3
            );

            this.createSidewalk(
                0,
                z + 11,
                500,
                3
            );

        } else {

            this.createSidewalk(
                x - 11,
                0,
                3,
                500
            );

            this.createSidewalk(
                x + 11,
                0,
                3,
                500
            );
        }
    }


    createSidewalk(
        x,
        z,
        width,
        depth
    ) {

        const geometry =
            new THREE.BoxGeometry(
                width,
                0.15,
                depth
            );

        const sidewalk =
            new THREE.Mesh(
                geometry,
                this.sidewalkMaterial
            );

        sidewalk.position.set(
            x,
            0.08,
            z
        );

        sidewalk.receiveShadow = true;

        this.scene.add(sidewalk);
    }
}
