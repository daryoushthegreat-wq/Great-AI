"""How warfarin and aspirin interact on clotting.

Render:  manimgx render animations/warfarin_aspirin.py WarfarinAspirin
Educational illustration only; not clinical advice.
"""

import manimgx as m

NODE_W = 3.2
NODE_H = 0.62
COL_X = 2.8
ROWS = [1.55, 0.55, -0.45, -1.45]
DIM = 0.25


def node(label: str, color: m.ManimColor) -> m.VGroup:
    box = m.RoundedRectangle(
        corner_radius=0.15, width=NODE_W, height=NODE_H,
        color=color, fill_opacity=0.15, stroke_width=3,
    )
    text = m.Text(label, font_size=24)
    if text.width > NODE_W - 0.3:
        text.scale_to_fit_width(NODE_W - 0.3)
    return m.VGroup(box, text.move_to(box))


def inhibit(drug: m.VGroup, target: m.VGroup, color: m.ManimColor) -> m.VGroup:
    """A T-bar from a drug to the step it blocks."""
    side = m.RIGHT if drug.get_x() < target.get_x() else m.LEFT
    start, end = drug.get_edge_center(side), target.get_edge_center(-side) - 0.05 * side
    bar = m.Line(end + 0.25 * m.UP, end + 0.25 * m.DOWN, color=color, stroke_width=8)
    return m.VGroup(m.Line(start, end, color=color, stroke_width=6), bar)


def column(labels: list[str], x: float, color: m.ManimColor) -> tuple[list[m.VGroup], list[m.Arrow]]:
    nodes = [node(label, color).move_to([x, y, 0]) for label, y in zip(labels, ROWS)]
    arrows = [
        m.Arrow(a.get_bottom(), b.get_top(), buff=0.05, color=m.GREY_B,
                stroke_width=3, max_tip_length_to_length_ratio=0.35)
        for a, b in zip(nodes, nodes[1:])
    ]
    return nodes, arrows


def pill(label: str, color: m.ManimColor) -> m.VGroup:
    text = m.Text(label, font_size=26, weight=m.BOLD, color=m.BLACK)
    box = m.RoundedRectangle(
        corner_radius=0.3, width=text.width + 0.5, height=0.6,
        color=color, fill_color=color, fill_opacity=1, stroke_width=0,
    )
    return m.VGroup(box, text.move_to(box))


class WarfarinAspirin(m.Scene):
    def construct(self) -> None:
        caption = m.Text("", font_size=24)

        def say(text: str, color: m.ManimColor = m.WHITE) -> m.Animation:
            nonlocal caption
            new = m.Text(text, font_size=24, color=color).to_edge(m.DOWN, buff=0.3)
            old, caption = caption, new
            return m.AnimationGroup(m.FadeOut(old), m.FadeIn(new))

        # Title
        title = m.Text("Warfarin + Aspirin: two hits on one clot", font_size=36, weight=m.BOLD)
        title.to_edge(m.UP, buff=0.3)
        self.play(m.Write(title), run_time=1.5)

        # Two arms of hemostasis
        left, l_arrows = column(
            ["Platelets", "COX-1", "Thromboxane A₂", "Platelet aggregation"], -COL_X, m.TEAL
        )
        right, r_arrows = column(
            ["Vitamin K (VKORC1)", "Factors II, VII, IX, X", "Thrombin", "Fibrin mesh"], COL_X, m.BLUE
        )
        l_head = m.Text("Primary: platelet plug", font_size=26, color=m.TEAL).next_to(left[0], m.UP, buff=0.25)
        r_head = m.Text("Secondary: coagulation", font_size=26, color=m.BLUE).next_to(right[0], m.UP, buff=0.25)

        clot = node("Stable clot", m.RED).move_to([0, -2.55, 0])
        clot[0].set_fill(m.RED, opacity=0.45)
        to_clot = [
            m.Arrow(left[-1].get_bottom(), clot.get_left(), buff=0.1, color=m.GREY_B, stroke_width=3),
            m.Arrow(right[-1].get_bottom(), clot.get_right(), buff=0.1, color=m.GREY_B, stroke_width=3),
        ]

        self.play(say("A stable clot needs both a platelet plug and a fibrin mesh."))
        self.play(m.FadeIn(l_head), m.FadeIn(r_head))
        for i in range(4):
            anims = [m.FadeIn(left[i], shift=0.2 * m.DOWN), m.FadeIn(right[i], shift=0.2 * m.DOWN)]
            if i > 0:
                anims += [m.GrowArrow(l_arrows[i - 1]), m.GrowArrow(r_arrows[i - 1])]
            self.play(*anims, run_time=0.6)
        self.play(*[m.GrowArrow(a) for a in to_clot], m.FadeIn(clot, scale=0.8))
        self.wait(1.5)

        # Aspirin blocks COX-1
        aspirin = pill("Aspirin", m.ORANGE).next_to(left[1], m.LEFT, buff=0.55)
        self.play(say("Aspirin irreversibly blocks platelet COX-1, so less thromboxane A₂ is made.", m.ORANGE),
                  m.FadeIn(aspirin, shift=0.3 * m.RIGHT))
        self.play(m.Create(inhibit(aspirin, left[1], m.ORANGE)),
                  left[1][0].animate.set_stroke(m.ORANGE, width=5).set_fill(m.ORANGE, opacity=0.25))
        self.play(*[mob.animate.set_opacity(DIM) for mob in [*left[2:], *l_arrows[1:], to_clot[0]]])
        self.play(say("The effect lasts for the platelet's lifespan: about 7–10 days.", m.ORANGE))
        self.wait(2)

        # Warfarin blocks vitamin K recycling
        warfarin = pill("Warfarin", m.YELLOW).next_to(right[0], m.RIGHT, buff=0.55)
        self.play(say("Warfarin blocks vitamin K recycling (VKORC1) in the liver.", m.YELLOW),
                  m.FadeIn(warfarin, shift=0.3 * m.LEFT))
        self.play(m.Create(inhibit(warfarin, right[0], m.YELLOW)),
                  right[0][0].animate.set_stroke(m.YELLOW, width=5).set_fill(m.YELLOW, opacity=0.25))
        self.play(*[mob.animate.set_opacity(DIM) for mob in [*right[1:], *r_arrows, to_clot[1]]])
        self.play(say("Fewer working factors II, VII, IX, X → less thrombin and fibrin. INR rises.", m.YELLOW))
        self.wait(2)

        # Combined effect
        self.play(say("Together, both arms are impaired: the bleeding risk adds up.", m.RED))
        weak = m.Text("Weak clot", font_size=24, color=m.GREY_B).move_to(clot)
        self.play(m.Transform(clot[1], weak), clot[0].animate.set_fill(m.RED, opacity=0.08).set_stroke(opacity=0.5))
        risk = m.VGroup(
            *[m.Text(t, font_size=28, weight=m.BOLD, color=m.RED) for t in ("Bleeding", "risk ↑")]
        ).arrange(m.DOWN, buff=0.12).move_to([0, 0.05, 0])
        self.play(m.FadeIn(risk, scale=1.4))
        self.play(m.Circumscribe(risk, color=m.RED))
        self.wait(2)

        # Clinical takeaways
        diagram = m.Group(*self.mobjects)
        diagram.remove(title)
        self.play(m.FadeOut(diagram))
        points = m.VGroup(
            m.Text("• Different mechanisms → additive bleeding risk, especially GI", font_size=26),
            m.Text("• INR measures warfarin only — not aspirin's platelet effect", font_size=26),
            m.Text("• Combine only with a clear indication (e.g. mechanical valve, recent stent)", font_size=26),
            m.Text("• If combined: low-dose aspirin, consider a PPI, review the need regularly", font_size=26),
        ).arrange(m.DOWN, aligned_edge=m.LEFT, buff=0.45).move_to([0, 0.2, 0])
        note = m.Text("Educational illustration — not clinical advice.", font_size=20, color=m.GREY_B)
        note.to_edge(m.DOWN, buff=0.3)
        self.play(m.LaggedStart(*[m.FadeIn(p, shift=0.2 * m.RIGHT) for p in points], lag_ratio=0.5), run_time=3)
        self.play(m.FadeIn(note))
        self.wait(4)
