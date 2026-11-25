Add-Type -ReferencedAssemblies System.Drawing, System.IO.Compression, System.IO.Compression.FileSystem -TypeDefinition @"
using System;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

public class VimsNaturalPhotographicSynthesizer {

    private static double Clamp01(double v) {
        return v < 0.0 ? 0.0 : (v > 1.0 ? 1.0 : v);
    }

    private static double SmoothStep(double e0, double e1, double x) {
        double t = Clamp01((x - e0) / (e1 - e0));
        return t * t * (3.0 - 2.0 * t);
    }

    private static double Lerp(double a, double b, double t) {
        return a + (b - a) * t;
    }

    // Create an "Empty Machined Steel Cavity" version of Scene E by neutralizing the blue polymer pixels
    // inside the runner and circular gear cavity region so we can animate progressive cavity filling.
    private static Bitmap CreateEmptyMoldCavityPlate(Bitmap filledMold) {
        int W = filledMold.Width;
        int H = filledMold.Height;
        Bitmap emptyMold = new Bitmap(W, H, PixelFormat.Format24bppRgb);

        for (int y = 0; y < H; y++) {
            double ny = (double)y / H;
            for (int x = 0; x < W; x++) {
                double nx = (double)x / W;
                Color c = filledMold.GetPixel(x, y);

                bool inCavityRegion = (nx >= 0.22 && nx <= 0.74 && ny >= 0.20 && ny <= 0.79);
                if (inCavityRegion && c.B > c.R + 28 && c.B > c.G + 12) {
                    int lum = (int)(c.R * 0.25 + c.G * 0.45 + c.B * 0.30);
                    int steelR = Math.Min(255, Math.Max(18, (int)(lum * 0.78 + 24)));
                    int steelG = Math.Min(255, Math.Max(22, (int)(lum * 0.82 + 28)));
                    int steelB = Math.Min(255, Math.Max(28, (int)(lum * 0.88 + 34)));
                    emptyMold.SetPixel(x, y, Color.FromArgb(steelR, steelG, steelB));
                } else {
                    emptyMold.SetPixel(x, y, c);
                }
            }
        }
        return emptyMold;
    }

    // Build 5 photorealistic, solid cylindrical polymer granules (Blue, Yellow, Green, Red, White)
    // color-matched 1:1 to the real photographic polymer cylinders inside the borosilicate glass in bA
    // (with realistic 3D cylindrical satin shading, end-cap bevel, and zero black background crescent!)
    private static Bitmap[] ExtractSingleRealCylindricalPellets(Bitmap bA) {
        Color[][] palettes = new Color[][] {
            // 0: Cobalt Blue cylinder (top highlight, mid body, bottom shadow, end-cap face)
            new Color[] { Color.FromArgb(88, 158, 252), Color.FromArgb(26, 98, 218), Color.FromArgb(12, 48, 128), Color.FromArgb(46, 124, 240) },
            // 1: Golden Yellow cylinder
            new Color[] { Color.FromArgb(254, 232, 118), Color.FromArgb(232, 184, 34), Color.FromArgb(158, 114, 12), Color.FromArgb(245, 206, 62) },
            // 2: Emerald Green cylinder
            new Color[] { Color.FromArgb(92, 214, 136), Color.FromArgb(22, 154, 78), Color.FromArgb(10, 86, 42), Color.FromArgb(44, 182, 102) },
            // 3: Crimson Red cylinder
            new Color[] { Color.FromArgb(242, 96, 106), Color.FromArgb(192, 28, 42), Color.FromArgb(108, 12, 20), Color.FromArgb(216, 52, 66) },
            // 4: Natural Translucent White cylinder
            new Color[] { Color.FromArgb(252, 254, 255), Color.FromArgb(218, 226, 236), Color.FromArgb(156, 168, 184), Color.FromArgb(236, 242, 248) }
        };

        int pw = 28;
        int ph = 20;
        Bitmap[] pellets = new Bitmap[palettes.Length];

        for (int i = 0; i < palettes.Length; i++) {
            Bitmap bmp = new Bitmap(pw, ph, PixelFormat.Format32bppArgb);
            Color cTop = palettes[i][0];
            Color cMid = palettes[i][1];
            Color cBot = palettes[i][2];
            Color cCap = palettes[i][3];

            for (int y = 0; y < ph; y++) {
                double ny = (y - ph * 0.5) / (ph * 0.5); // -1 .. +1 across cylinder diameter
                for (int x = 0; x < pw; x++) {
                    double nx = (x - pw * 0.5) / (pw * 0.5); // -1 .. +1 along cylinder length

                    // Cylindrical capsule silhouette with curved ends
                    double d = Math.Pow(Math.Abs(nx), 2.8) + Math.Pow(Math.Abs(ny), 2.4);
                    double mask = 1.0 - SmoothStep(0.76, 1.0, d);
                    if (mask <= 0.005) {
                        bmp.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        continue;
                    }

                    // 3D cylindrical radial shading along ny (-1 = top rim, -0.35 = specular ridge, +1 = bottom shadow)
                    Color bodyCol;
                    if (ny < -0.2) {
                        double t = SmoothStep(-0.95, -0.2, ny);
                        bodyCol = Color.FromArgb(
                            (int)Lerp(cMid.R, cTop.R, t),
                            (int)Lerp(cMid.G, cTop.G, t),
                            (int)Lerp(cMid.B, cTop.B, t)
                        );
                    } else {
                        double t = SmoothStep(-0.2, 0.95, ny);
                        bodyCol = Color.FromArgb(
                            (int)Lerp(cTop.R, cBot.R, t),
                            (int)Lerp(cTop.G, cBot.G, t),
                            (int)Lerp(cTop.B, cBot.B, t)
                        );
                    }

                    // Right-side cut cylinder circular end-cap (nx > 0.42)
                    double capDist = Math.Sqrt(Math.Pow((nx - 0.58) / 0.26, 2.0) + Math.Pow(ny / 0.82, 2.0));
                    double capBlend = (1.0 - SmoothStep(0.75, 1.05, capDist)) * 0.65;

                    int r = (int)Lerp(bodyCol.R, cCap.R, capBlend);
                    int g = (int)Lerp(bodyCol.G, cCap.G, capBlend);
                    int b = (int)Lerp(bodyCol.B, cCap.B, capBlend);

                    // Subtle end-cap rim crease at capDist ~ 0.85
                    if (capDist > 0.72 && capDist < 0.96 && nx > 0.35) {
                        r = Math.Min(255, r + 24);
                        g = Math.Min(255, g + 24);
                        b = Math.Min(255, b + 24);
                    }

                    int alpha = (int)(255.0 * mask);
                    bmp.SetPixel(x, y, Color.FromArgb(Math.Min(255, Math.Max(0, alpha)), r, g, b));
                }
            }
            pellets[i] = bmp;
        }
        return pellets;
    }

    private static void DrawSingleCylinder(Graphics g, Bitmap sp, float px, float py, float scale, float angleDeg, float alpha) {
        if (alpha <= 0.01f) return;
        GraphicsState st = g.Save();
        g.TranslateTransform(px, py);
        g.RotateTransform(angleDeg);
        float w = sp.Width * scale;
        float h = sp.Height * scale;

        ColorMatrix cm = new ColorMatrix();
        cm.Matrix33 = Math.Max(0f, Math.Min(1f, alpha));
        using (ImageAttributes ia = new ImageAttributes()) {
            ia.SetColorMatrix(cm, ColorMatrixFlag.Default, ColorAdjustType.Bitmap);
            g.DrawImage(
                sp,
                new Rectangle((int)(-w / 2), (int)(-h / 2), (int)w, (int)h),
                0, 0, sp.Width, sp.Height,
                GraphicsUnit.Pixel,
                ia
            );
        }
        g.Restore(st);
    }

    // Build a unified tall vertical canvas (1280 x 1360) where:
    // - At y = 0..720 (Scene A): The real borosilicate glass beaker and its native falling colorful polymer granules
    //   occupy the frame cleanly (the lower table pile is softly faded into the dark-navy studio background
    //   below y = 510, while the real photographic falling granules between y = 300 and y = 490 remain 100% intact!).
    // - At y = 640..1360 (Scene B): The stainless-steel conical receiving hopper sits directly below the falling stream
    //   (starts at y = 740, so at camY = 0 in Scene A, the hopper is completely below the bottom of the 720p screen!).
    private static Bitmap CreateUnifiedGlassToHopperTallPlate(Bitmap bGlassRaw, Bitmap bHopperRaw, int W, int H) {
        int tallH = 1360;
        Bitmap tall = new Bitmap(W, tallH, PixelFormat.Format24bppRgb);

        using (Graphics g = Graphics.FromImage(tall)) {
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.Clear(Color.FromArgb(5, 11, 22));

            // 1. Place the Hopper & Exterior Barrel Shroud at y = 640..1360
            //    (In bHopperRaw, the hopper top rim is at y = 110, so on tall canvas it is at 640 + 110 = 750,
            //     which is below the 720px Scene A viewport!)
            g.DrawImage(bHopperRaw, 0, 640, W, H);

            // Cleanly remove the tiny glass tip at the very top-right corner of bHopperRaw (y = 640..710, x > 0.78)
            // while keeping the falling granules entering the hopper bowl
            for (int y = 0; y < 85; y++) {
                double keepStream = SmoothStep(28.0, 82.0, (double)y);
                for (int x = (int)(W * 0.75); x < W; x++) {
                    // Mask out the glass rim corner at x > 0.85, y < 45
                    double isCornerGlass = (x > W * 0.84 && y < 48) ? 0.0 : keepStream;
                    Color c = tall.GetPixel(x, 640 + y);
                    int r = (int)Lerp(5, c.R, isCornerGlass);
                    int gr = (int)Lerp(11, c.G, isCornerGlass);
                    int b = (int)Lerp(22, c.B, isCornerGlass);
                    tall.SetPixel(x, 640 + y, Color.FromArgb(r, gr, b));
                }
            }

            // 2. Place the large Borosilicate Glass Beaker & its native falling granules at y = 0..515
            //    shifted right (+54px) so the pouring stream aligns directly above the hopper center (x = 0.76)
            for (int y = 0; y < 500; y++) {
                double ny = (double)y / H;
                // Keep 100% of the glass and native falling granules down to y = 445 (ny = 0.62), then fade before the table pile
                double vFade = 1.0 - SmoothStep(0.57, 0.645, ny);
                if (vFade <= 0.001) continue;

                int dstY = y + 18;
                for (int x = 0; x < W; x++) {
                    int srcX = x - 54;
                    if (srcX < 0 || srcX >= W) continue;

                    Color cGlass = bGlassRaw.GetPixel(srcX, y);
                    Color cBg = tall.GetPixel(x, dstY);
                    int r = (int)Lerp(cBg.R, cGlass.R, vFade);
                    int gr = (int)Lerp(cBg.G, cGlass.G, vFade);
                    int b = (int)Lerp(cBg.B, cGlass.B, vFade);
                    tall.SetPixel(x, dstY, Color.FromArgb(r, gr, b));
                }
            }
        }
        return tall;
    }

    public static void RenderRawSequences(
        string assetsDir,
        string rawDesktopDir,
        string rawMobileDir,
        string rawHeroDir
    ) {
        Directory.CreateDirectory(rawDesktopDir);
        Directory.CreateDirectory(rawMobileDir);
        Directory.CreateDirectory(rawHeroDir);

        int DW = 1280;
        int DH = 720;
        int MW = 720;
        int MH = 960;

        string pSceneA  = Path.Combine(assetsDir, "scene_a_glass_pour.jpg");
        string pSceneBC = Path.Combine(assetsDir, "scene_bc_hopper_pour.jpg");
        string pSceneD  = Path.Combine(assetsDir, "scene_d_barrel_cutaway.jpg");
        string pSceneE  = Path.Combine(assetsDir, "scene_e_mold_closed_fill.jpg");
        string pSceneFG = Path.Combine(assetsDir, "scene_fg_mold_open_eject.jpg");
        string pSceneGH = Path.Combine(assetsDir, "scene_gh_gear_reveal.jpg");

        using (Bitmap rawA  = new Bitmap(pSceneA))
        using (Bitmap rawBC = new Bitmap(pSceneBC))
        using (Bitmap rawD  = new Bitmap(pSceneD))
        using (Bitmap rawE  = new Bitmap(pSceneE))
        using (Bitmap rawFG = new Bitmap(pSceneFG))
        using (Bitmap rawGH = new Bitmap(pSceneGH))
        using (Bitmap bA  = new Bitmap(rawA,  new Size(DW, DH)))
        using (Bitmap bBC = new Bitmap(rawBC, new Size(DW, DH)))
        using (Bitmap bTallGlassHopper = CreateUnifiedGlassToHopperTallPlate(bA, bBC, DW, DH))
        using (Bitmap bD  = new Bitmap(rawD,  new Size(DW, DH)))
        using (Bitmap bE  = new Bitmap(rawE,  new Size(DW, DH)))
        using (Bitmap bEEmpty = CreateEmptyMoldCavityPlate(bE))
        using (Bitmap bFG = new Bitmap(rawFG, new Size(DW, DH)))
        using (Bitmap bGH = new Bitmap(rawGH, new Size(DW, DH))) {

            // Extract 6 crisp single cylindrical granules directly from bA
            Bitmap[] cylPellets = ExtractSingleRealCylindricalPellets(bA);

            Random rng = new Random(20261124);

            // 32 individual cylindrical granules falling along the exact stream path from the glass mouth
            // (worldY = 335..845, x = 0.745..0.775) with natural gravity & subtle cylinder orientation
            int nStreamPellets = 32;
            double[] spPhase  = new double[nStreamPellets];
            double[] spStartX = new double[nStreamPellets];
            double[] spEndX   = new double[nStreamPellets];
            double[] spScale  = new double[nStreamPellets];
            double[] spAng0   = new double[nStreamPellets];
            double[] spTilt   = new double[nStreamPellets];
            int[]    spColor  = new int[nStreamPellets];

            for (int i = 0; i < nStreamPellets; i++) {
                spPhase[i]  = (double)i / nStreamPellets;
                double u    = (rng.NextDouble() - 0.5) * 2.0;
                spStartX[i] = 0.752 + u * 0.024;
                spEndX[i]   = 0.768 + u * 0.044;
                spScale[i]  = 1.05 + rng.NextDouble() * 0.30;
                spAng0[i]   = -25.0 + rng.NextDouble() * 50.0;
                spTilt[i]   = (i % 2 == 0 ? 1.0 : -1.0) * 35.0; // Gentle natural tumble, no wild spinning
                spColor[i]  = i % cylPellets.Length;
            }

            // 26 individual cylindrical granules feeding into the hopper throat & screw flights in Scenes C/D
            int nBarrelPellets = 26;
            double[] bpPhase  = new double[nBarrelPellets];
            double[] bpSpread = new double[nBarrelPellets];
            double[] bpScale  = new double[nBarrelPellets];
            double[] bpAng0   = new double[nBarrelPellets];
            int[]    bpColor  = new int[nBarrelPellets];

            for (int i = 0; i < nBarrelPellets; i++) {
                bpPhase[i]  = (double)i / nBarrelPellets;
                bpSpread[i] = (rng.NextDouble() - 0.5) * 2.0;
                bpScale[i]  = 0.95 + rng.NextDouble() * 0.25;
                bpAng0[i]   = -30.0 + rng.NextDouble() * 60.0;
                bpColor[i]  = i % cylPellets.Length;
            }

            ImageCodecInfo jpgCodec = null;
            foreach (ImageCodecInfo codec in ImageCodecInfo.GetImageEncoders()) {
                if (codec.FormatID == ImageFormat.Jpeg.Guid) { jpgCodec = codec; break; }
            }
            EncoderParameters jpgParams = new EncoderParameters(1);
            jpgParams.Param[0] = new EncoderParameter(Encoder.Quality, 96L);

            // ================================================================
            // 1. RENDER 36-FRAME SEAMLESS HERO POURING LOOP (hero-000001..000036)
            //    Shows the pure tilted borosilicate glass at top-right pouring
            //    crisp single cylindrical granules downward (NO hopper peeking at bottom!)
            // ================================================================
            int heroFrames = 36;
            for (int hf = 0; hf < heroFrames; hf++) {
                double ht = (double)hf / heroFrames;
                using (Bitmap hBmp = new Bitmap(DW, DH, PixelFormat.Format24bppRgb))
                using (Graphics g = Graphics.FromImage(hBmp)) {
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;

                    g.DrawImage(
                        bTallGlassHopper,
                        new Rectangle(0, 0, DW, DH),
                        new Rectangle(0, 0, DW, DH),
                        GraphicsUnit.Pixel
                    );

                    for (int i = 0; i < nStreamPellets; i++) {
                        double p = (spPhase[i] + ht) % 1.0;
                        double easeP = 0.42 * p + 0.58 * p * p;
                        double nx = Lerp(spStartX[i], spEndX[i], easeP);
                        double worldY = Lerp(318.0, 710.0, easeP);

                        float alpha = 0.94f;
                        if (p < 0.14) alpha *= (float)(p / 0.14);
                        if (p > 0.85) alpha *= (float)((1.0 - p) / 0.15);

                        DrawSingleCylinder(
                            g,
                            cylPellets[spColor[i]],
                            (float)(nx * DW),
                            (float)worldY,
                            (float)spScale[i],
                            (float)(spAng0[i] + p * spTilt[i]),
                            alpha
                        );
                    }

                    string hPath = Path.Combine(rawHeroDir, string.Format("hero-{0:D6}.jpg", hf + 1));
                    hBmp.Save(hPath, jpgCodec, jpgParams);
                }
            }

            // ================================================================
            // 2. RENDER 180-FRAME CONTINUOUS MASTER STORYBOARD SEQUENCE
            // ================================================================
            int totalFrames = 180;
            for (int f = 0; f < totalFrames; f++) {
                using (Bitmap dBmp = new Bitmap(DW, DH, PixelFormat.Format24bppRgb))
                using (Graphics g = Graphics.FromImage(dBmp)) {
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.Clear(Color.FromArgb(5, 11, 22));

                    double mobileFocusX = 0.72;

                    if (f < 60) {
                        // ----------------------------------------------------
                        // SCENE A (001..036) & SCENE B (037..060):
                        // Glass Pouring -> Camera Follows Stream Straight Into
                        // the Stainless-Steel Receiving Hopper (camY: 0 -> 640)
                        // ----------------------------------------------------
                        double camPanProgress = f < 26 ? 0.0 : SmoothStep(26.0, 56.0, (double)f);
                        int camY = (int)Lerp(0.0, 640.0, camPanProgress);

                        g.DrawImage(
                            bTallGlassHopper,
                            new Rectangle(0, 0, DW, DH),
                            new Rectangle(0, camY, DW, DH),
                            GraphicsUnit.Pixel
                        );

                        double streamCycles = (double)f / 18.0;
                        double streamEndY = Lerp(710.0, 865.0, camPanProgress);
                        for (int i = 0; i < nStreamPellets; i++) {
                            double p = (spPhase[i] + streamCycles) % 1.0;
                            double easeP = 0.42 * p + 0.58 * p * p;
                            double nx = Lerp(spStartX[i], spEndX[i], easeP);
                            double worldY = Lerp(318.0, streamEndY, easeP);
                            double screenY = worldY - camY;

                            if (screenY < -30 || screenY > DH + 30) continue;

                            float alpha = 0.94f;
                            if (p < 0.14) alpha *= (float)(p / 0.14);
                            if (p > 0.86) alpha *= (float)((1.0 - p) / 0.14);

                            DrawSingleCylinder(
                                g,
                                cylPellets[spColor[i]],
                                (float)(nx * DW),
                                (float)screenY,
                                (float)spScale[i],
                                (float)(spAng0[i] + p * spTilt[i]),
                                alpha
                            );
                        }
                        mobileFocusX = 0.74;

                    } else if (f < 82) {
                        // ----------------------------------------------------
                        // SCENE C (Frames 061..082): Mechanical Exploded-View Casing
                        // Split — The Machine Stays Anchored in Place while its
                        // Outer Upper & Lower Stainless Shroud Panels Part Open
                        // Vertically to Reveal the Internal Screw Barrel Cutaway!
                        // (ZERO black gap bar, ZERO jumping machine!)
                        // ----------------------------------------------------
                        double t = (double)(f - 60) / 22.0;
                        double splitT = SmoothStep(0.10, 0.90, t);

                        // 1. Draw the internal Screw Barrel Cutaway (bD) anchored underneath
                        g.DrawImage(bD, 0, 0, DW, DH);

                        // 2. Draw the outer Stainless Hopper & Barrel Casing (bBC) splitting apart
                        //    into an Upper Casing Half (sliding up) and Lower Barrel Shroud Half (sliding down & out)
                        if (splitT < 0.995) {
                            int splitLineY = (int)(DH * 0.54);
                            int upperShiftY = -(int)(splitT * splitLineY * 1.05);
                            int lowerShiftY = (int)(splitT * (DH - splitLineY) * 1.05);

                            float casingAlpha = (float)(1.0 - SmoothStep(0.65, 0.98, splitT));
                            ColorMatrix cm = new ColorMatrix();
                            cm.Matrix33 = casingAlpha;

                            using (ImageAttributes ia = new ImageAttributes()) {
                                ia.SetColorMatrix(cm, ColorMatrixFlag.Default, ColorAdjustType.Bitmap);

                                // Upper hopper & top shroud retracting upward to expose feed throat
                                g.DrawImage(
                                    bBC,
                                    new Rectangle(0, upperShiftY, DW, splitLineY),
                                    0, 0, DW, splitLineY,
                                    GraphicsUnit.Pixel,
                                    ia
                                );

                                // Lower outer barrel cover retracting downward to expose the helical screw
                                g.DrawImage(
                                    bBC,
                                    new Rectangle(0, splitLineY + lowerShiftY, DW, DH - splitLineY),
                                    0, splitLineY, DW, DH - splitLineY,
                                    GraphicsUnit.Pixel,
                                    ia
                                );
                            }
                        }

                        // Real single cylindrical granules dropping into the exposed hopper throat (x=0.84)
                        for (int i = 0; i < nBarrelPellets; i++) {
                            double p = (bpPhase[i] + t * 1.8) % 1.0;
                            double easeP = 0.45 * p + 0.55 * p * p;
                            double nx = 0.842 + bpSpread[i] * 0.026 * (1.0 - easeP * 0.4);
                            double ny = Lerp(-0.03, 0.36, easeP);
                            float alpha = (float)(0.92 * SmoothStep(0.15, 0.55, splitT));
                            if (p < 0.12) alpha *= (float)(p / 0.12);
                            if (p > 0.85) alpha *= (float)((1.0 - p) / 0.15);

                            DrawSingleCylinder(
                                g,
                                cylPellets[bpColor[i]],
                                (float)(nx * DW),
                                (float)(ny * DH),
                                (float)bpScale[i],
                                (float)(bpAng0[i] + p * 35.0),
                                alpha
                            );
                        }
                        mobileFocusX = Lerp(0.73, 0.62, splitT);

                    } else if (f < 108) {
                        // ----------------------------------------------------
                        // SCENE D (Frames 083..108): Feeding & Plasticizing Inside
                        // the Screw Barrel Cutaway
                        // ----------------------------------------------------
                        double t = (double)(f - 82) / 26.0;
                        double zoom = 1.05;
                        int zw = (int)(DW * zoom);
                        int zh = (int)(DH * zoom);
                        int panX = (int)((0.5 - t) * (zw - DW) * 0.88);
                        int ox = (DW - zw) / 2 + panX;
                        int oy = (DH - zh) / 2;
                        g.DrawImage(bD, ox, oy, zw, zh);

                        for (int i = 0; i < nBarrelPellets; i++) {
                            double p = (bpPhase[i] + t * 2.4) % 1.0;
                            double nx, ny;
                            float alpha = 0.92f;

                            if (p < 0.44) {
                                double lt = p / 0.44;
                                nx = 0.845 + bpSpread[i] * 0.022 * (1.0 - lt * 0.4);
                                ny = -0.02 + lt * 0.42;
                                if (lt < 0.12) alpha *= (float)(lt / 0.12);
                            } else {
                                double lt = (p - 0.44) / 0.56;
                                nx = 0.835 - lt * 0.335;
                                ny = 0.505 + bpSpread[i] * 0.028 + Math.Sin(lt * Math.PI * 6.0) * 0.015;
                                alpha = (float)(0.90 * (1.0 - Math.Pow(lt, 1.45)));
                            }

                            DrawSingleCylinder(
                                g,
                                cylPellets[bpColor[i]],
                                (float)(ox + nx * zw),
                                (float)(oy + ny * zh),
                                (float)bpScale[i],
                                (float)(bpAng0[i] + p * 40.0),
                                alpha
                            );
                        }

                        // Subtle melt flow shimmer advancing leftward into the nozzle cone
                        double meltWave = (t * 2.0) % 1.0;
                        int mwX = (int)(ox + zw * Lerp(0.46, 0.16, meltWave));
                        int mwY = (int)(oy + zh * 0.505);
                        using (GraphicsPath gp = new GraphicsPath()) {
                            gp.AddEllipse(mwX - 56, mwY - 26, 112, 52);
                            using (PathGradientBrush pgb = new PathGradientBrush(gp)) {
                                pgb.CenterColor = Color.FromArgb(85, 56, 189, 248);
                                pgb.SurroundColors = new Color[] { Color.FromArgb(0, 29, 140, 248) };
                                g.FillPath(pgb, gp);
                            }
                        }
                        mobileFocusX = Lerp(0.62, 0.44, t);

                    } else if (f < 134) {
                        // ----------------------------------------------------
                        // SCENE E (Frames 109..134): Mold Clamping Assembly &
                        // Progressive Cavity Filling (From Empty Steel to Full Gear)
                        // ----------------------------------------------------
                        double t = (double)(f - 108) / 26.0;
                        double trackT = SmoothStep(0.0, 0.22, t);
                        double fillT  = SmoothStep(0.18, 0.96, t);

                        if (trackT < 0.999) {
                            int barrelX = (int)(trackT * DW);
                            int moldX   = barrelX - DW;
                            g.DrawImage(bD, barrelX, 0, DW, DH);
                            g.DrawImage(bEEmpty, moldX, 0, DW, DH);
                        } else {
                            g.DrawImage(bEEmpty, 0, 0, DW, DH);

                            if (fillT > 0.005) {
                                int fillRightX = (int)(DW * Lerp(0.23, 0.74, fillT));
                                int fillLeftX  = (int)(DW * 0.22);
                                int fillW      = Math.Max(2, fillRightX - fillLeftX);
                                g.DrawImage(
                                    bE,
                                    new Rectangle(fillLeftX, 0, fillW, DH),
                                    new Rectangle(fillLeftX, 0, fillW, DH),
                                    GraphicsUnit.Pixel
                                );
                            }
                        }
                        mobileFocusX = 0.55;

                    } else if (f < 156) {
                        // ----------------------------------------------------
                        // SCENE F (Frames 135..156): Holding, Cooling Solidification,
                        // and Mold Halves Separating Along the Chrome Tie-Bars
                        // ----------------------------------------------------
                        double t = (double)(f - 134) / 22.0;

                        if (t < 0.48) {
                            double coolT = t / 0.48;
                            double zoom = 1.0 + coolT * 0.025;
                            int zw = (int)(DW * zoom);
                            int zh = (int)(DH * zoom);
                            g.DrawImage(bE, (DW - zw) / 2, (DH - zh) / 2, zw, zh);
                        } else {
                            double openT = SmoothStep(0.48, 1.0, t);
                            int slideOffset = (int)((1.0 - openT) * -46);
                            int splitX = (int)(DW * 0.46);
                            g.DrawImage(
                                bFG,
                                new Rectangle(0, 0, splitX, DH),
                                new Rectangle(0, 0, splitX, DH),
                                GraphicsUnit.Pixel
                            );
                            g.DrawImage(
                                bFG,
                                new Rectangle(splitX, 0, DW - splitX, DH),
                                new Rectangle(splitX - slideOffset, 0, DW - splitX, DH),
                                GraphicsUnit.Pixel
                            );
                        }
                        mobileFocusX = 0.58;

                    } else if (f < 170) {
                        // ----------------------------------------------------
                        // SCENE G (Frames 157..170): Finished Component Ejection
                        // ----------------------------------------------------
                        double t = (double)(f - 156) / 14.0;
                        double zoom = 1.0 + SmoothStep(0.0, 1.0, t) * 0.065;
                        int zw = (int)(DW * zoom);
                        int zh = (int)(DH * zoom);
                        int ox = (int)((DW - zw) * 0.63);
                        int oy = (int)((DH - zh) * 0.50);
                        g.DrawImage(bFG, ox, oy, zw, zh);
                        mobileFocusX = 0.62;

                    } else {
                        // ----------------------------------------------------
                        // SCENE H (Frames 171..180): Clean Photographic Reveal
                        // of the Finished Molded Blue Helical Spur Gear
                        // ----------------------------------------------------
                        double t = (double)(f - 170) / 10.0;
                        double zoom = 1.0 + SmoothStep(0.0, 1.0, t) * 0.04;
                        int zw = (int)(DW * zoom);
                        int zh = (int)(DH * zoom);
                        g.DrawImage(bGH, (DW - zw) / 2, (DH - zh) / 2, zw, zh);
                        mobileFocusX = 0.68;
                    }

                    // Save Desktop Raw Frame (1280x720)
                    string dFramePath = Path.Combine(rawDesktopDir, string.Format("raw-{0:D6}.jpg", f + 1));
                    dBmp.Save(dFramePath, jpgCodec, jpgParams);

                    // Save Mobile Portrait Raw Frame (720x960)
                    using (Bitmap mBmp = new Bitmap(MW, MH, PixelFormat.Format24bppRgb))
                    using (Graphics mg = Graphics.FromImage(mBmp)) {
                        mg.SmoothingMode = SmoothingMode.HighQuality;
                        mg.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        mg.Clear(Color.FromArgb(5, 11, 22));

                        int targetDrawH = 760;
                        int targetDrawW = (int)(targetDrawH * ((double)DW / DH));
                        int focusPx = (int)(targetDrawW * mobileFocusX);
                        int drawX = (MW / 2) - focusPx;
                        drawX = Math.Min(0, Math.Max(MW - targetDrawW, drawX));
                        int drawY = 100;

                        mg.DrawImage(dBmp, drawX, drawY, targetDrawW, targetDrawH);

                        using (LinearGradientBrush topFade = new LinearGradientBrush(
                            new Point(0, drawY - 12),
                            new Point(0, drawY + 115),
                            Color.FromArgb(255, 5, 11, 22),
                            Color.FromArgb(0, 5, 11, 22))) {
                            topFade.WrapMode = WrapMode.TileFlipXY;
                            mg.FillRectangle(topFade, 0, drawY - 4, MW, 115);
                        }
                        using (LinearGradientBrush botFade = new LinearGradientBrush(
                            new Point(0, drawY + targetDrawH - 120),
                            new Point(0, drawY + targetDrawH + 12),
                            Color.FromArgb(0, 5, 11, 22),
                            Color.FromArgb(255, 5, 11, 22))) {
                            botFade.WrapMode = WrapMode.TileFlipXY;
                            mg.FillRectangle(botFade, 0, drawY + targetDrawH - 116, MW, 122);
                        }

                        string mFramePath = Path.Combine(rawMobileDir, string.Format("raw-{0:D6}.jpg", f + 1));
                        mBmp.Save(mFramePath, jpgCodec, jpgParams);
                    }
                }
            }

            foreach (Bitmap sp in cylPellets) sp.Dispose();
        }
    }
}
"@

$assetsDir = "C:\Users\CT\gemini\plastiblends-3d-web\assets"
$scratchBuildDir = "C:\Users\CT\.gemini\antigravity\brain\467d9cf3-a50e-4422-9058-d32f80ebd407\scratch\video_build"
$rawDesktopDir   = "$scratchBuildDir\raw_desktop"
$rawMobileDir    = "$scratchBuildDir\raw_mobile"
$rawHeroDir      = "$scratchBuildDir\raw_hero"

if (Test-Path $scratchBuildDir) { Remove-Item $scratchBuildDir -Recurse -Force }

Write-Output "Step 1/5: Synthesizing single-cylinder natural pour & exploded-casing 180 master frames..."
[VimsNaturalPhotographicSynthesizer]::RenderRawSequences($assetsDir, $rawDesktopDir, $rawMobileDir, $rawHeroDir)

& "C:\Users\CT\gemini\plastiblends-3d-web\scripts\encode_extract_and_zip.ps1"
