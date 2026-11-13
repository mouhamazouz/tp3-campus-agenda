
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

type Statut = "Complet" | "Presque complet" | "Ouvert";

const evenements: Evenement[] = [
  { id: "E01", titre: "Atelier React", categorie: "Atelier", capacite: 25, inscrits: 25 },
  { id: "E02", titre: "Conférence IA", categorie: "Conférence", capacite: 70, inscrits: 52 },
  { id: "E03", titre: "Sécurité mobile", categorie: "Atelier", capacite: 20, inscrits: 17 },
  { id: "E04", titre: "Design UI", categorie: "Atelier", capacite: 18, inscrits: 9 },
  { id: "E05", titre: "Forum projets", categorie: "Rencontre", capacite: 50, inscrits: 49 },
  { id: "E06", titre: "Découverte Git", categorie: "Atelier", capacite: 24, inscrits: 24 },
];

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const places = placesRestantes(e);

  if (places === 0) return "Complet";
  if (places <= 3) return "Presque complet";
  return "Ouvert";
}

const totalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  (e) => placesRestantes(e) === 0
).length;

const evenementsDisponibles = evenements.filter(
  (e) => placesRestantes(e) > 0
).length;

const totalPlaces = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);

const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === "Atelier" && placesRestantes(e) > 0
);

const mode: "tous" | "ateliers" = "tous";

const evenementsAffiches =
  mode === "tous"
    ? evenements
    : evenements.filter(
        (e) => e.categorie === "Atelier" && placesRestantes(e) > 0
      );

// 6. Composant BadgeEtat
type BadgeProps = {
  statut: Statut;
};

function BadgeEtat({ statut }: BadgeProps) {
  const couleur =
    statut === "Complet"
      ? styles.badgeComplet
      : statut === "Presque complet"
      ? styles.badgePresque
      : styles.badgeOuvert;

  return (
    <View style={[styles.badge, couleur]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}

// 7. Composant CarteEvenement
type CarteProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteProps) {
  const places = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.carte}>
      <View style={styles.ligneCarte}>
        <Text style={styles.titreCarte}>{evenement.titre}</Text>
        <BadgeEtat statut={statut} />
      </View>

      <Text style={styles.categorie}>
        Catégorie : {evenement.categorie}
      </Text>

      <Text style={styles.places}>
        {places} places restantes
      </Text>

      <Text style={styles.inscriptions}>
        Inscriptions : {evenement.inscrits} / {evenement.capacite}
      </Text>
    </View>
  );
}

type StatistiqueProps = {
  libelle: string;
  valeur: number;
};

function BlocStatistique({ libelle, valeur }: StatistiqueProps) {
  return (
    <View style={styles.blocStatistique}>
      <Text style={styles.valeurStatistique}>{valeur}</Text>
      <Text style={styles.libelleStatistique}>{libelle}</Text>
    </View>
  );
}

// 9. Ecran principal
export default function App() {
  return (
    <View style={styles.container}>
      <FlatList
        data={evenementsAffiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.titrePrincipal}>CampusAgenda</Text>
            <Text style={styles.sousTitre}>
              Événements du campus
            </Text>

            <View style={styles.statistiques}>
              <BlocStatistique
                libelle="Événements"
                valeur={totalEvenements}
              />
              <BlocStatistique
                libelle="Places restantes"
                valeur={totalPlaces}
              />
              <BlocStatistique
                libelle="Événements complets"
                valeur={evenementsComplets}
              />
              <BlocStatistique
                libelle="Événements disponibles"
                valeur={evenementsDisponibles}
              />
              <BlocStatistique
                libelle="Ateliers disponibles"
                valeur={ateliersDisponibles.length}
              />
            </View>

            <Text style={styles.titreSection}>
              {mode === "tous"
                ? "Tous les événements"
                : "Ateliers disponibles"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.messageVide}>
            Aucun événement disponible.
          </Text>
        }
        contentContainerStyle={styles.liste}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6FC",
  },
  liste: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 30,
    flexGrow: 1,
  },
  titrePrincipal: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#173B70",
  },
  sousTitre: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 5,
    marginBottom: 20,
  },
  statistiques: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  blocStatistique: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  valeurStatistique: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#173B70",
  },
  libelleStatistique: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 5,
  },
  titreSection: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#173B70",
    marginBottom: 15,
  },
  carte: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  ligneCarte: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  titreCarte: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1E293B",
    flexShrink: 1,
    marginRight: 8,
  },
  categorie: {
    color: "#64748B",
    marginTop: 10,
  },
  places: {
    color: "#173B70",
    fontWeight: "bold",
    marginTop: 8,
  },
  inscriptions: {
    color: "#64748B",
    marginTop: 5,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  badgeComplet: {
    backgroundColor: "#FEE2E2",
  },
  badgePresque: {
    backgroundColor: "#FFEDD5",
  },
  badgeOuvert: {
    backgroundColor: "#DCFCE7",
  },
  texteBadge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#334155",
  },
  messageVide: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 16,
    marginTop: 30,
  },
});
